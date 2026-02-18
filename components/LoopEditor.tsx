import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TrimState, LoopSettings, LoopMode, AspectRatio } from '../types';
import { Timeline } from './Timeline';
import { Button } from './Button';
import { formatTime } from '../utils/format';
import { Play, Pause, Video, FileVideo, Settings2, Loader2, Wand2, Repeat, RotateCcw, Eye, MonitorPlay, Square, RectangleHorizontal, RectangleVertical, Maximize, Zap, Sparkles } from 'lucide-react';
import { DEFAULT_FADE_DURATION } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface LoopEditorProps {
  file: File;
  onBack: () => void;
}

const getTargetDimensions = (ratio: AspectRatio, originalW: number, originalH: number) => {
  switch (ratio) {
    case '16:9': return { width: 1920, height: 1080 };
    case '1:1': return { width: 1080, height: 1080 };
    case '9:16': return { width: 1080, height: 1920 };
    case 'original': 
    default: 
      // Ensure dimensions are even for codecs like H.264
      return { 
        width: originalW % 2 === 0 ? originalW : originalW - 1, 
        height: originalH % 2 === 0 ? originalH : originalH - 1 
      };
  }
};

export const LoopEditor: React.FC<LoopEditorProps> = ({ file, onBack }) => {
  // Video Source
  const [videoSrc, setVideoSrc] = useState<string>('');
  const { t } = useLanguage();
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'original'>('preview');
  const [trim, setTrim] = useState<TrimState>({ start: 0, end: 10, duration: 10 });
  const [settings, setSettings] = useState<LoopSettings>({ 
    fadeDuration: DEFAULT_FADE_DURATION, 
    isAutoFade: true,
    loopMode: 'crossfade',
    loopCount: 1,
    aspectRatio: 'original'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progress, setProgress] = useState(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null); // For Crossfade overlay
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const ffmpegRef = useRef<any>(null);

  // Initialize
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Load Video Metadata
  const onLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setTrim({ start: 0, end: dur, duration: dur });
      // Apply Micro-Crossfade default (0.3s) unless video is too short
      const defaultFade = Math.min(dur * 0.5, DEFAULT_FADE_DURATION);
      setSettings(s => ({ ...s, fadeDuration: defaultFade }));
    }
  };

  // ------------------------------------------------------------------------
  // Preview Animation Logic
  // ------------------------------------------------------------------------
  
  // 1. Seamless Loop (Canvas)
  const renderSeamlessFrame = () => {
    const v1 = videoRef.current; // Acts as Tail (E-d to E) during transition
    const v2 = video2Ref.current; // Acts as Head (S to S+d) and Body
    const cvs = canvasRef.current;
    if (!v1 || !v2 || !cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const { start, end } = trim;
    const { fadeDuration, loopMode, aspectRatio } = settings;
    
    // Canvas Sizing & Background
    const { width: targetW, height: targetH } = getTargetDimensions(aspectRatio, v1.videoWidth, v1.videoHeight);
    
    if (cvs.width !== targetW || cvs.height !== targetH) {
        cvs.width = targetW;
        cvs.height = targetH;
    }

    // Clear with Black (Letterboxing/Pillarboxing)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, targetW, targetH);

    // Calculate Video Draw Dimensions (Contain)
    const scale = Math.min(targetW / v1.videoWidth, targetH / v1.videoHeight);
    const drawW = v1.videoWidth * scale;
    const drawH = v1.videoHeight * scale;
    const offsetX = (targetW - drawW) / 2;
    const offsetY = (targetH - drawH) / 2;

    const now = performance.now();
    const rawTime = (now - startTimeRef.current) / 1000;

    if (loopMode === 'boomerang') {
      // Type C: Boomerang
      const oneWayDur = end - start;
      const cycleDur = oneWayDur * 2;
      const t = rawTime % cycleDur;
      
      let targetTime;
      if (t < oneWayDur) {
        targetTime = start + t; // Forward
      } else {
        const backT = t - oneWayDur;
        targetTime = end - backT; // Backward
      }
      
      if (Math.abs(v1.currentTime - targetTime) > 0.1) v1.currentTime = targetTime;
      ctx.drawImage(v1, offsetX, offsetY, drawW, drawH);

    } else {
      // Type A & B: Soft-Linear Crossfade (Zero-Glitch Logic)
      const loopLen = (end - start) - fadeDuration;
      
      if (loopLen <= 0) {
        ctx.drawImage(v1, offsetX, offsetY, drawW, drawH);
        requestRef.current = requestAnimationFrame(renderSeamlessFrame);
        return;
      }

      const t = rawTime % loopLen;

      if (t < fadeDuration) {
        // [Transition Phase]
        // v1 (Tail) plays from E-d to E
        // v2 (Head) plays from S to S+d
        // We overlay v2 (Head) on top of v1 (Tail) fading in.
        
        const tailTime = (end - fadeDuration) + t;
        const headTime = start + t;

        if (Math.abs(v1.currentTime - tailTime) > 0.2) v1.currentTime = tailTime;
        if (Math.abs(v2.currentTime - headTime) > 0.2) v2.currentTime = headTime;

        // Draw Bottom (Tail) - Full Opacity
        ctx.globalAlpha = 1.0;
        ctx.drawImage(v1, offsetX, offsetY, drawW, drawH);

        // Draw Top (Head) - Fading In (0 -> 1)
        const alpha = t / fadeDuration;
        ctx.globalAlpha = alpha;
        ctx.drawImage(v2, offsetX, offsetY, drawW, drawH);
        
      } else {
        // [Body Phase]
        // v2 continues from Head into Body (S+d to E-d)
        // v1 is pre-seeked to E-d to be ready for the next loop start
        
        const bodyTime = start + t;
        if (Math.abs(v2.currentTime - bodyTime) > 0.2) v2.currentTime = bodyTime;

        ctx.globalAlpha = 1.0;
        ctx.drawImage(v2, offsetX, offsetY, drawW, drawH);
        
        // Optimization: Ensure v1 is ready at E-d for the instant the loop restarts
        const readyTime = end - fadeDuration;
        if (Math.abs(v1.currentTime - readyTime) > 0.5) {
             v1.currentTime = readyTime;
             v1.pause(); // Pause to hold frame
        }
      }
    }
    
    requestRef.current = requestAnimationFrame(renderSeamlessFrame);
  };

  // 2. Original Hard Cut (Decoupled Player)
  const renderOriginalFrame = () => {
    // In Original View, we just let the video element play naturally.
    // No manual time manipulation needed unless we want to force loop of the whole file.
    const v1 = videoRef.current;
    if (v1 && v1.ended) {
        v1.currentTime = 0;
        v1.play();
    }
    requestRef.current = requestAnimationFrame(renderOriginalFrame);
  };

  // Main Loop Switcher
  const animationLoop = useCallback(() => {
    if (viewMode === 'preview') {
      renderSeamlessFrame();
    } else {
      renderOriginalFrame();
    }
  }, [viewMode, trim, settings]); 

  // Handle Play/Pause Toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      videoRef.current?.pause();
      video2Ref.current?.pause();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    } else {
      setIsPlaying(true);
      startTimeRef.current = performance.now();
      
      if (viewMode === 'original') {
         // Start from beginning if at end, or continue
         if(videoRef.current?.ended) videoRef.current.currentTime = 0;
         videoRef.current?.play();
      } else {
         // Preview mode logic manages play state inside render loop usually, 
         // but we need to trigger play to unlock frames
         videoRef.current?.play();
         video2Ref.current?.play();
      }
      
      if (viewMode === 'preview') {
          requestRef.current = requestAnimationFrame(renderSeamlessFrame);
      } else {
          requestRef.current = requestAnimationFrame(renderOriginalFrame);
      }
    }
  };

  // Handle View Mode Switching
  useEffect(() => {
    // Reset when switching modes
    setIsPlaying(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    videoRef.current?.pause();
    video2Ref.current?.pause();
    
    // When entering original mode, show full video
    if (viewMode === 'original' && videoRef.current) {
        videoRef.current.currentTime = 0;
    }

    // Visibility handled in render
  }, [viewMode]);

  // Update canvas size initially
  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
        // Init with defaults
        const { width, height } = getTargetDimensions(settings.aspectRatio, videoRef.current.videoWidth, videoRef.current.videoHeight);
        canvasRef.current.width = width;
        canvasRef.current.height = height;
    }
  }, [videoSrc, settings.aspectRatio]);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // ------------------------------------------------------------------------
  // Handlers & Logic
  // ------------------------------------------------------------------------

  const updateTrim = (s: number, e: number) => {
    setTrim(prev => {
      const newDur = e - s;
      let newFade = settings.fadeDuration;
      
      if (settings.loopMode !== 'boomerang') {
        // Enforce safe fade limits but allow micro-fade
        if (newFade > newDur / 2) newFade = newDur / 2;
        if (settings.isAutoFade) newFade = Math.min(newDur * 0.5, DEFAULT_FADE_DURATION);
      }
      
      setSettings(prevS => ({...prevS, fadeDuration: newFade}));
      return { ...prev, start: s, end: e };
    });
  };

  // Ultra-Precise Type B Analysis
  const runOptimalAnalysis = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    setProgressMsg(t.editor.procAnal);
    
    const v = videoRef.current;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const wasPlaying = !v.paused;
    v.pause();

    try {
      v.currentTime = trim.start;
      await new Promise(r => v.addEventListener('seeked', r, { once: true }));
      
      ctx.drawImage(v, 0, 0, 64, 64);
      const startData = ctx.getImageData(0, 0, 64, 64).data;

      const searchWindow = Math.min(5, (trim.end - trim.start) / 2);
      const step = 0.05; 
      
      let bestDiff = Infinity;
      let bestFade = settings.fadeDuration;

      for (let offset = 0.1; offset <= searchWindow; offset += step) {
        const checkTime = trim.end - offset;
        v.currentTime = checkTime;
        await new Promise(r => v.addEventListener('seeked', r, { once: true }));
        
        ctx.drawImage(v, 0, 0, 64, 64);
        const currentData = ctx.getImageData(0, 0, 64, 64).data;
        
        let diff = 0;
        let count = 0;
        for (let i = 0; i < startData.length; i += 4) {
             const r = startData[i] - currentData[i];
             const g = startData[i+1] - currentData[i+1];
             const b = startData[i+2] - currentData[i+2];
             diff += (r*r + g*g + b*b);
             count++;
        }
        const mse = diff / count;
        
        if (mse < bestDiff) {
            bestDiff = mse;
            bestFade = offset;
        }

        if (offset % 0.5 < step) await new Promise(r => setTimeout(r, 0));
      }

      setSettings(s => ({ ...s, fadeDuration: bestFade, isAutoFade: false, loopMode: 'optimal' }));
      setProgressMsg(t.editor.procAnalDone.replace('{time}', bestFade.toFixed(2)));
      
    } catch (e) {
      console.error(e);
      setProgressMsg(t.editor.procAnalFail);
    } finally {
      v.currentTime = trim.start;
      setIsProcessing(false);
      setTimeout(() => setProgressMsg(''), 2000);
    }
  };

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    if (!window.FFmpeg) throw new Error("FFmpeg script not loaded. Check internet connection.");

    try {
        const ffmpeg = new window.FFmpeg.FFmpeg();
        ffmpegRef.current = ffmpeg;
        
        ffmpeg.on('log', ({ message }: { message: string }) => console.log('FFmpeg Log:', message));
        ffmpeg.on('progress', ({ progress }: { progress: number }) => setProgress(Math.round(progress * 100)));
    
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        await ffmpeg.load({
          coreURL: await window.FFmpegUtil.toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await window.FFmpegUtil.toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
    
        return ffmpeg;
    } catch (err) {
        console.error("FFmpeg Load Error:", err);
        throw new Error("FFmpeg 초기화 실패. 브라우저가 SharedArrayBuffer를 지원하지 않거나 보안 헤더가 누락되었습니다.");
    }
  };

  const handleExport = async (format: 'mp4' | 'gif') => {
    try {
      setIsProcessing(true);
      setProgress(0);
      setProgressMsg(t.editor.procInit);
      
      const ffmpeg = await loadFFmpeg();
      
      setProgressMsg(t.editor.procData);
      await ffmpeg.writeFile('input.mp4', await window.FFmpegUtil.fetchFile(videoSrc));

      const { start, end } = trim;
      const { fadeDuration, loopMode, loopCount, aspectRatio } = settings;
      
      // 1. Construct Scale Filter
      let scaleFilter = '';
      let sourceLabel = '[0:v]'; 
      
      if (aspectRatio !== 'original') {
          const { width, height } = getTargetDimensions(aspectRatio, videoRef.current!.videoWidth, videoRef.current!.videoHeight);
          // Scale and Pad (Black background)
          scaleFilter = `[0:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black,setsar=1[v_scaled];`;
          sourceLabel = '[v_scaled]';
      }

      // 2. Construct Loop Logic
      let loopFilter = '';
      let intermediateFile = 'base_loop.mp4';
      
      if (loopMode === 'boomerang') {
        // Boomerang: trim -> split -> reverse -> concat
        loopFilter = [
          `${sourceLabel}trim=start=${start}:end=${end},setpts=PTS-STARTPTS[fwd]`,
          `[fwd]split[fwd1][fwd2]`,
          `[fwd2]reverse[rev]`,
          `[fwd1][rev]concat=n=2:v=1:a=0[base_out]`
        ].join(';');
      } else {
        // Type A & B: Soft-Linear Crossfade (xfade)
        // We trim the source into three parts:
        // 1. Head: S to S+d (will be overlaid)
        // 2. Body: S+d to E-d (middle part)
        // 3. Tail: E-d to E (will be overlaying)
        // xfade transition: Tail fades into Head.
        // Result: [Transition(Tail->Head)] + [Body]
        
        const d = fadeDuration;
        
        loopFilter = [
            `${sourceLabel}split=3[in1][in2][in3]`,
            
            // Tail (E-d to E)
            `[in1]trim=start=${end - d}:end=${end},setpts=PTS-STARTPTS[tail]`,
            
            // Head (S to S+d)
            `[in2]trim=start=${start}:end=${start + d},setpts=PTS-STARTPTS[head]`,
            
            // Body (S+d to E-d)
            `[in3]trim=start=${start + d}:end=${end - d},setpts=PTS-STARTPTS[body]`,
            
            // Crossfade Tail to Head
            // This creates the seamless loop junction
            `[tail][head]xfade=transition=fade:duration=${d}:offset=0[trans]`,
            
            // Concat Transition + Body
            `[trans][body]concat=n=2:v=1:a=0[base_out]`
        ].join(';');
      }

      const fullFilter = scaleFilter + loopFilter;

      setProgressMsg(t.editor.procRender);
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-filter_complex', fullFilter,
        '-map', '[base_out]',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', // High quality encoding
        intermediateFile
      ]);

      const finalFile = format === 'mp4' ? 'final_output.mp4' : 'final_output.gif';
      
      setProgressMsg(t.editor.procMerge.replace('{count}', loopCount.toString()));
      const loopCmdArgs = ['-stream_loop', (loopCount - 1).toString(), '-i', intermediateFile];
      
      if (format === 'mp4') {
        await ffmpeg.exec([
           ...loopCmdArgs,
           '-c', 'copy',
           finalFile
        ]);
      } else {
        // For GIF, we need to generate palette from the SCALED output
        await ffmpeg.exec([
           ...loopCmdArgs,
           '-vf', 'fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
           finalFile
        ]);
      }

      const data = await ffmpeg.readFile(finalFile);
      const blobType = format === 'mp4' ? 'video/mp4' : 'image/gif';
      const url = URL.createObjectURL(new Blob([data], { type: blobType }));
      downloadFile(url, `seamless_loop_${loopMode}.${format}`);

      setProgressMsg(t.editor.procDone);
      setTimeout(() => setIsProcessing(false), 2000);

    } catch (e: any) {
      console.error(e);
      let errMsg = t.editor.procErr;
      if (e.message && e.message.includes("SharedArrayBuffer")) {
          errMsg = t.editor.procSecErr;
      }
      setProgressMsg(errMsg);
      setTimeout(() => setIsProcessing(false), 4000);
    }
  };

  const downloadFile = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getOneLoopDuration = () => {
    if (settings.loopMode === 'boomerang') return (trim.end - trim.start) * 2;
    return (trim.end - trim.start) - settings.fadeDuration;
  };
  const totalDuration = Math.max(0, getOneLoopDuration() * settings.loopCount);

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} size="sm">{t.editor.back}</Button>
        <h1 className="text-xl font-bold text-gray-100">{t.editor.title}</h1>
        <div className="w-20"></div>
      </div>

      {/* Preview Area Container */}
      <div className="space-y-4">
        {/* Toggle Buttons */}
        <div className="flex justify-center gap-2">
            <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center px-6 py-2 rounded-full font-medium transition-all ${viewMode === 'preview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
                <Eye className="w-4 h-4 mr-2" /> {t.editor.preview}
            </button>
            <button
                onClick={() => setViewMode('original')}
                className={`flex items-center px-6 py-2 rounded-full font-medium transition-all ${viewMode === 'original' ? 'bg-gray-200 text-black shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
                <MonitorPlay className="w-4 h-4 mr-2" /> {t.editor.original}
            </button>
        </div>

        {/* Video/Canvas Display */}
        <div className="relative bg-black w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex items-center justify-center group" style={{ height: '50vh' }}>
            {/* Raw Video for Original Mode - Playing Full File */}
            <video 
                ref={videoRef} 
                src={videoSrc} 
                className="w-full h-full object-contain"
                style={{ display: viewMode === 'original' ? 'block' : 'none' }}
                muted 
                playsInline
                loop 
                onLoadedMetadata={onLoadedMetadata} 
            />
            
            {/* Hidden Reference Video for Dual Stream Crossfade */}
            <video 
                ref={video2Ref} 
                src={videoSrc} 
                className="hidden" 
                muted 
                playsInline 
            />
            
            {/* Processed Canvas for Preview Mode */}
            <canvas 
                ref={canvasRef} 
                className="w-full h-full object-contain"
                style={{ display: viewMode === 'preview' ? 'block' : 'none' }}
            />

            {/* Play Overlay */}
            {!isPlaying && (
            <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors z-10">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                </div>
            </button>
            )}
        </div>
      </div>

      <div className="flex justify-center -mt-2">
         <Button onClick={togglePlay} size="lg" className="w-32 shadow-lg">
            {isPlaying ? <><Pause className="w-5 h-5 mr-2" /> {t.editor.pause}</> : <><Play className="w-5 h-5 mr-2" /> {t.editor.play}</>}
         </Button>
      </div>

      {/* Aspect Ratio Selection */}
      <div className="bg-[#1e1e1e] p-6 rounded-xl space-y-4 shadow-lg border border-white/5">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center">
            <Maximize className="w-4 h-4 mr-2" /> {t.editor.aspectRatio}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             <button
                onClick={() => setSettings(s => ({...s, aspectRatio: 'original'}))}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${settings.aspectRatio === 'original' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
             >
                <Maximize className="w-6 h-6 mb-2 text-gray-300" />
                <span className="text-sm font-medium">{t.editor.arOriginal}</span>
             </button>
             <button
                onClick={() => setSettings(s => ({...s, aspectRatio: '16:9'}))}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${settings.aspectRatio === '16:9' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
             >
                <RectangleHorizontal className="w-6 h-6 mb-2 text-gray-300" />
                <span className="text-sm font-medium">{t.editor.ar169}</span>
             </button>
             <button
                onClick={() => setSettings(s => ({...s, aspectRatio: '1:1'}))}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${settings.aspectRatio === '1:1' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
             >
                <Square className="w-6 h-6 mb-2 text-gray-300" />
                <span className="text-sm font-medium">{t.editor.ar11}</span>
             </button>
             <button
                onClick={() => setSettings(s => ({...s, aspectRatio: '9:16'}))}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${settings.aspectRatio === '9:16' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
             >
                <RectangleVertical className="w-6 h-6 mb-2 text-gray-300" />
                <span className="text-sm font-medium">{t.editor.ar916}</span>
             </button>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-[#1e1e1e] p-6 rounded-xl space-y-4 shadow-lg border border-white/5">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center">
            <RotateCcw className="w-4 h-4 mr-2" /> {t.editor.loopMode}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
                onClick={() => setSettings(s => ({...s, loopMode: 'crossfade'}))}
                className={`p-4 rounded-lg border text-left transition-all ${settings.loopMode === 'crossfade' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
            >
                <div className="font-bold text-white mb-1">{t.editor.modeA}</div>
                <div className="text-xs text-gray-400">{t.editor.modeADesc}</div>
            </button>

            <button 
                onClick={runOptimalAnalysis}
                className={`p-4 rounded-lg border text-left transition-all ${settings.loopMode === 'optimal' ? 'bg-purple-900/30 border-purple-500 ring-1 ring-purple-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
            >
                <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span>{t.editor.modeB}</span>
                    <Wand2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-gray-400">{t.editor.modeBDesc}</div>
            </button>

            <button 
                onClick={() => setSettings(s => ({...s, loopMode: 'boomerang'}))}
                className={`p-4 rounded-lg border text-left transition-all ${settings.loopMode === 'boomerang' ? 'bg-green-900/30 border-green-500 ring-1 ring-green-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
            >
                <div className="font-bold text-white mb-1">{t.editor.modeC}</div>
                <div className="text-xs text-gray-400">{t.editor.modeCDesc}</div>
            </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#1e1e1e] p-6 rounded-xl space-y-4 shadow-lg border border-white/5">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center">
                <Settings2 className="w-4 h-4 mr-2" /> {t.editor.timeline}
            </h3>
        </div>
        <Timeline trim={trim} onTrimChange={updateTrim} currentTime={trim.start} />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
           <div className="col-span-2 flex items-center justify-between bg-black/20 p-2.5 rounded-lg border border-white/5">
              <span className="text-xs font-medium text-gray-400 ml-1">{t.editor.start}</span>
              <div className="flex gap-1">
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start - 0.01, trim.end)}>-0.01</Button>
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start - 0.1, trim.end)}>-0.1</Button>
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start + 0.1, trim.end)}>+0.1</Button>
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start + 0.01, trim.end)}>+0.01</Button>
              </div>
           </div>
           <div className="col-span-2 flex items-center justify-between bg-black/20 p-2.5 rounded-lg border border-white/5">
              <span className="text-xs font-medium text-gray-400 ml-1">{t.editor.end}</span>
              <div className="flex gap-1">
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start, trim.end - 0.01)}>-0.01</Button>
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start, trim.end - 0.1)}>-0.1</Button>
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start, trim.end + 0.1)}>+0.1</Button>
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start, trim.end + 0.01)}>+0.01</Button>
              </div>
           </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fade Control */}
          <div className={`bg-[#1e1e1e] p-6 rounded-xl space-y-4 shadow-lg border border-white/5 ${settings.loopMode === 'boomerang' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
             <div className="flex justify-between items-center">
                 <h3 className="text-sm font-semibold text-gray-300">{t.editor.fade}</h3>
                 {settings.loopMode !== 'boomerang' && (
                    <div className="flex items-center space-x-2">
                        {settings.fadeDuration > 0 && (
                             <span className="flex items-center text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 mr-2">
                                <Zap className="w-3 h-3 mr-1 fill-current" /> {t.editor.fadeApplied}
                             </span>
                        )}
                        <span className="text-xs text-gray-500">
                            {settings.isAutoFade ? t.editor.auto : t.editor.manual}
                        </span>
                        <button 
                        onClick={() => setSettings(s => ({...s, isAutoFade: !s.isAutoFade}))}
                        className={`w-8 h-4 rounded-full relative transition-colors ${settings.isAutoFade ? 'bg-blue-600' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.isAutoFade ? 'left-4.5' : 'left-0.5'}`} style={{ left: settings.isAutoFade ? '18px' : '2px' }} />
                        </button>
                    </div>
                 )}
             </div>
             <div className="flex items-center gap-4">
                <span className="text-2xl font-mono text-white w-20 text-center">{settings.fadeDuration.toFixed(2)}s</span>
                <input 
                    type="range" 
                    min={0.1} 
                    max={(trim.end - trim.start) / 2} 
                    step={0.05}
                    value={settings.fadeDuration}
                    onChange={(e) => setSettings(s => ({...s, isAutoFade: false, fadeDuration: parseFloat(e.target.value)}))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
             </div>
             
             {/* Auto-Fade Status Indicator for Type B or Auto mode */}
             {(settings.loopMode === 'optimal' || settings.isAutoFade) && (
                 <div className="flex items-center justify-center p-2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium animate-pulse">
                    <Zap className="w-3 h-3 mr-1.5" />
                    {t.editor.autoFadeActive}
                 </div>
             )}

             {/* Anti-Glitch Active Indicator */}
             {settings.loopMode !== 'boomerang' && (
                 <div className="flex items-center justify-center p-2 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    {t.editor.antiGlitchActive}
                 </div>
             )}
          </div>

          {/* Loop Count */}
          <div className="bg-[#1e1e1e] p-6 rounded-xl space-y-4 shadow-lg border border-white/5">
             <div className="flex justify-between items-center">
                 <h3 className="text-sm font-semibold text-gray-300 flex items-center">
                    <Repeat className="w-4 h-4 mr-2" /> {t.editor.loopCount}
                 </h3>
             </div>
             <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center bg-black/30 rounded-lg p-1 border border-gray-700">
                     <button 
                        onClick={() => setSettings(s => ({...s, loopCount: Math.max(1, s.loopCount - 1)}))}
                        className="w-10 h-10 hover:bg-gray-700 rounded flex items-center justify-center text-xl font-bold"
                     >-</button>
                     <span className="w-16 text-center font-mono text-xl">{settings.loopCount}</span>
                     <button 
                        onClick={() => setSettings(s => ({...s, loopCount: Math.min(20, s.loopCount + 1)}))}
                        className="w-10 h-10 hover:bg-gray-700 rounded flex items-center justify-center text-xl font-bold"
                     >+</button>
                 </div>
                 <div className="text-right">
                     <div className="text-xs text-gray-500 mb-1">{t.editor.finalDuration}</div>
                     <div className="text-xl font-mono text-blue-400">
                        {formatTime(totalDuration)}
                     </div>
                 </div>
             </div>
          </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
         <Button 
            disabled={isProcessing} 
            onClick={() => handleExport('mp4')} 
            className="h-14 text-lg bg-indigo-600 hover:bg-indigo-700"
            icon={isProcessing ? <Loader2 className="animate-spin" /> : <Video />}
         >
            {t.editor.saveMp4}
         </Button>
         <Button 
            disabled={isProcessing} 
            onClick={() => handleExport('gif')} 
            className="h-14 text-lg bg-pink-600 hover:bg-pink-700"
            icon={isProcessing ? <Loader2 className="animate-spin" /> : <FileVideo />}
         >
            {t.editor.saveGif}
         </Button>
      </div>

      {/* Progress Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">{progressMsg}</h2>
            <p className="text-gray-400 mb-6 text-sm font-mono">{t.editor.doNotClose}</p>
            {progress > 0 && (
                <div className="w-80">
                    <div className="flex justify-between text-xs text-blue-300 mb-1">
                        <span>{t.editor.progress}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}
        </div>
      )}

    </div>
  );
};