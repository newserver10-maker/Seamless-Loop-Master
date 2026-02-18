import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TrimState, LoopSettings, LoopMode, AspectRatio } from '../types';
import { Timeline } from './Timeline';
import { Button } from './Button';
import { formatTime } from '../utils/format';
import { Play, Pause, Video, FileVideo, Settings2, Loader2, Wand2, Repeat, RotateCcw, Eye, MonitorPlay, Square, RectangleHorizontal, RectangleVertical, Maximize, Zap } from 'lucide-react';
import { DEFAULT_FADE_DURATION } from '../constants';

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
    const v1 = videoRef.current;
    const v2 = video2Ref.current;
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
      // Type A & B: Crossfade / Optimal
      const loopLen = (end - start) - fadeDuration;
      
      if (loopLen <= 0) {
        ctx.drawImage(v1, offsetX, offsetY, drawW, drawH);
        requestRef.current = requestAnimationFrame(renderSeamlessFrame);
        return;
      }

      const t = rawTime % loopLen;

      // Base (Head)
      const v1Target = start + t;
      // Overlay (Tail)
      const v2Target = (end - fadeDuration) + t;

      if (Math.abs(v1.currentTime - v1Target) > 0.2) v1.currentTime = v1Target;
      if (Math.abs(v2.currentTime - v2Target) > 0.2 && t < fadeDuration) v2.currentTime = v2Target;

      ctx.globalAlpha = 1.0;
      ctx.drawImage(v1, offsetX, offsetY, drawW, drawH);

      // Micro-Crossfade Logic:
      // We overlay the "Tail" (End of clip) onto the "Head" (Start of clip)
      // The Tail fades out from 1.0 to 0.0 opacity over `fadeDuration`.
      if (t < fadeDuration) {
        const alpha = 1 - (t / fadeDuration);
        ctx.globalAlpha = alpha;
        ctx.drawImage(v2, offsetX, offsetY, drawW, drawH);
      }
    }
    
    requestRef.current = requestAnimationFrame(renderSeamlessFrame);
  };

  // 2. Original Hard Cut (Video Element)
  const renderOriginalFrame = () => {
    const v1 = videoRef.current;
    if (!v1) return;
    
    // Manual Looping Logic for "Original" view
    if (v1.currentTime >= trim.end) {
      v1.currentTime = trim.start;
    } else if (v1.currentTime < trim.start) {
        v1.currentTime = trim.start;
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
      videoRef.current?.play();
      if (viewMode === 'preview') video2Ref.current?.play();
      
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
    setProgressMsg('초정밀 구간 분석 중 (Type B)...');
    
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
      setProgressMsg(`분석 완료! 최적 오버랩: ${bestFade.toFixed(2)}초`);
      
    } catch (e) {
      console.error(e);
      setProgressMsg('분석 실패');
    } finally {
      v.currentTime = trim.start;
      setIsProcessing(false);
      setTimeout(() => setProgressMsg(''), 2000);
    }
  };

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    if (!window.FFmpeg) throw new Error("FFmpeg not loaded");

    const ffmpeg = new window.FFmpeg.FFmpeg();
    ffmpegRef.current = ffmpeg;
    
    ffmpeg.on('log', ({ message }: { message: string }) => console.log(message));
    ffmpeg.on('progress', ({ progress }: { progress: number }) => setProgress(Math.round(progress * 100)));

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await window.FFmpegUtil.toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await window.FFmpegUtil.toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    return ffmpeg;
  };

  const handleExport = async (format: 'mp4' | 'gif') => {
    try {
      setIsProcessing(true);
      setProgress(0);
      setProgressMsg('FFmpeg 엔진 준비 중...');
      
      const ffmpeg = await loadFFmpeg();
      
      setProgressMsg('데이터 처리 중...');
      await ffmpeg.writeFile('input.mp4', await window.FFmpegUtil.fetchFile(videoSrc));

      const { start, end } = trim;
      const { fadeDuration, loopMode, loopCount, aspectRatio } = settings;
      
      // 1. Construct Scale Filter
      let scaleFilter = '';
      let sourceLabel = '[0:v]'; // Default source
      
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
        // Crossfade / Micro-Crossfade
        // Robust Logic: 
        // 1. Base Head (Start to Fade)
        // 2. Base Body (Fade to End-Fade)
        // 3. Tail (End-Fade to End) -> Faded Out (Alpha 1->0)
        // 4. Overlay Tail on Head -> Merged Head
        // 5. Concat Merged Head + Body
        
        loopFilter = [
          // Extract Base (Start to End-Fade) and Tail (End-Fade to End)
          `${sourceLabel}trim=start=${start}:end=${end - fadeDuration},setpts=PTS-STARTPTS[base]`,
          `${sourceLabel}trim=start=${end - fadeDuration}:end=${end},setpts=PTS-STARTPTS[tail]`,
          
          // Split Base into Head (where overlap happens) and Body
          `[base]split[base_head][base_body]`,
          `[base_head]trim=start=0:end=${fadeDuration},setpts=PTS-STARTPTS[head]`,
          `[base_body]trim=start=${fadeDuration},setpts=PTS-STARTPTS[body]`,
          
          // Apply Fade Out to Tail (Alpha 1 -> 0)
          `[tail]format=yuva420p,fade=t=out:st=0:d=${fadeDuration}:alpha=1[faded_tail]`,
          
          // Overlay Faded Tail onto Head (Head is opaque background)
          `[head][faded_tail]overlay[merged_head]`,
          
          // Concatenate
          `[merged_head][body]concat=n=2:v=1:a=0[base_out]`
        ].join(';');
      }

      const fullFilter = scaleFilter + loopFilter;

      setProgressMsg('루프 구간 렌더링 중...');
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-filter_complex', fullFilter,
        '-map', '[base_out]',
        '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23',
        intermediateFile
      ]);

      const finalFile = format === 'mp4' ? 'final_output.mp4' : 'final_output.gif';
      
      setProgressMsg(`최종 파일 병합 중 (${loopCount}회 반복)...`);
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

      setProgressMsg('완료!');
      setTimeout(() => setIsProcessing(false), 2000);

    } catch (e) {
      console.error(e);
      setProgressMsg('오류가 발생했습니다.');
      setTimeout(() => setIsProcessing(false), 3000);
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
        <Button variant="ghost" onClick={onBack} size="sm">← 뒤로가기</Button>
        <h1 className="text-xl font-bold text-gray-100">심리스 루프 마스터 Pro</h1>
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
                <Eye className="w-4 h-4 mr-2" /> 미리보기 (Seamless)
            </button>
            <button
                onClick={() => setViewMode('original')}
                className={`flex items-center px-6 py-2 rounded-full font-medium transition-all ${viewMode === 'original' ? 'bg-gray-200 text-black shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
                <MonitorPlay className="w-4 h-4 mr-2" /> 원본 보기 (Hard Cut)
            </button>
        </div>

        {/* Video/Canvas Display */}
        <div className="relative bg-black w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex items-center justify-center group" style={{ height: '50vh' }}>
            {/* Raw Video for Original Mode */}
            <video 
                ref={videoRef} 
                src={videoSrc} 
                className="w-full h-full object-contain"
                style={{ display: viewMode === 'original' ? 'block' : 'none' }}
                muted 
                playsInline 
                onLoadedMetadata={onLoadedMetadata} 
            />
            
            {/* Hidden Reference Video */}
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
            {isPlaying ? <><Pause className="w-5 h-5 mr-2" /> 정지</> : <><Play className="w-5 h-5 mr-2" /> 재생</>}
         </Button>
      </div>

      {/* Aspect Ratio Selection */}
      <div className="bg-[#1e1e1e] p-6 rounded-xl space-y-4 shadow-lg border border-white/5">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center">
            <Maximize className="w-4 h-4 mr-2" /> 화면 비율 설정
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             <button
                onClick={() => setSettings(s => ({...s, aspectRatio: 'original'}))}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${settings.aspectRatio === 'original' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
             >
                <Maximize className="w-6 h-6 mb-2 text-gray-300" />
                <span className="text-sm font-medium">원본 비율 유지</span>
             </button>
             <button
                onClick={() => setSettings(s => ({...s, aspectRatio: '16:9'}))}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${settings.aspectRatio === '16:9' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
             >
                <RectangleHorizontal className="w-6 h-6 mb-2 text-gray-300" />
                <span className="text-sm font-medium">16:9 와이드</span>
             </button>
             <button
                onClick={() => setSettings(s => ({...s, aspectRatio: '1:1'}))}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${settings.aspectRatio === '1:1' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
             >
                <Square className="w-6 h-6 mb-2 text-gray-300" />
                <span className="text-sm font-medium">1:1 정방형</span>
             </button>
             <button
                onClick={() => setSettings(s => ({...s, aspectRatio: '9:16'}))}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${settings.aspectRatio === '9:16' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
             >
                <RectangleVertical className="w-6 h-6 mb-2 text-gray-300" />
                <span className="text-sm font-medium">9:16 세로형</span>
             </button>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-[#1e1e1e] p-6 rounded-xl space-y-4 shadow-lg border border-white/5">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center">
            <RotateCcw className="w-4 h-4 mr-2" /> 루프 모드 선택
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
                onClick={() => setSettings(s => ({...s, loopMode: 'crossfade'}))}
                className={`p-4 rounded-lg border text-left transition-all ${settings.loopMode === 'crossfade' ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
            >
                <div className="font-bold text-white mb-1">강제 오버랩 (A타입)</div>
                <div className="text-xs text-gray-400">사용자가 설정한 구간을 강제로 부드럽게 연결합니다.</div>
            </button>

            <button 
                onClick={runOptimalAnalysis}
                className={`p-4 rounded-lg border text-left transition-all ${settings.loopMode === 'optimal' ? 'bg-purple-900/30 border-purple-500 ring-1 ring-purple-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
            >
                <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span>초정밀 분석 (B타입)</span>
                    <Wand2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-gray-400">프레임 단위 정밀 분석으로 최적의 연결 지점을 찾습니다.</div>
            </button>

            <button 
                onClick={() => setSettings(s => ({...s, loopMode: 'boomerang'}))}
                className={`p-4 rounded-lg border text-left transition-all ${settings.loopMode === 'boomerang' ? 'bg-green-900/30 border-green-500 ring-1 ring-green-500' : 'bg-black/20 border-gray-700 hover:border-gray-500'}`}
            >
                <div className="font-bold text-white mb-1">역재생 루프 (C타입)</div>
                <div className="text-xs text-gray-400">앞뒤로 반복 재생하여 자연스러운 움직임을 만듭니다.</div>
            </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#1e1e1e] p-6 rounded-xl space-y-4 shadow-lg border border-white/5">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center">
                <Settings2 className="w-4 h-4 mr-2" /> 구간 정밀 편집
            </h3>
        </div>
        <Timeline trim={trim} onTrimChange={updateTrim} currentTime={trim.start} />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
           <div className="col-span-2 flex items-center justify-between bg-black/20 p-2.5 rounded-lg border border-white/5">
              <span className="text-xs font-medium text-gray-400 ml-1">시작점</span>
              <div className="flex gap-1">
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start - 0.01, trim.end)}>-0.01</Button>
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start - 0.1, trim.end)}>-0.1</Button>
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start + 0.1, trim.end)}>+0.1</Button>
                 <Button variant="secondary" size="sm" onClick={() => updateTrim(trim.start + 0.01, trim.end)}>+0.01</Button>
              </div>
           </div>
           <div className="col-span-2 flex items-center justify-between bg-black/20 p-2.5 rounded-lg border border-white/5">
              <span className="text-xs font-medium text-gray-400 ml-1">종료점</span>
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
                 <h3 className="text-sm font-semibold text-gray-300">페이드(겹침) 시간</h3>
                 {settings.loopMode !== 'boomerang' && (
                    <div className="flex items-center space-x-2">
                        {settings.fadeDuration > 0 && (
                             <span className="flex items-center text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 mr-2">
                                <Zap className="w-3 h-3 mr-1 fill-current" /> 부드러운 루프 적용됨
                             </span>
                        )}
                        <span className="text-xs text-gray-500">
                            {settings.isAutoFade ? '자동' : '수동'}
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
          </div>

          {/* Loop Count */}
          <div className="bg-[#1e1e1e] p-6 rounded-xl space-y-4 shadow-lg border border-white/5">
             <div className="flex justify-between items-center">
                 <h3 className="text-sm font-semibold text-gray-300 flex items-center">
                    <Repeat className="w-4 h-4 mr-2" /> 반복 횟수 (Loop Count)
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
                     <div className="text-xs text-gray-500 mb-1">최종 영상 길이</div>
                     <div className="text-xl font-mono text-blue-400">
                        {formatTime(totalDuration)} 초
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
            MP4 저장
         </Button>
         <Button 
            disabled={isProcessing} 
            onClick={() => handleExport('gif')} 
            className="h-14 text-lg bg-pink-600 hover:bg-pink-700"
            icon={isProcessing ? <Loader2 className="animate-spin" /> : <FileVideo />}
         >
            GIF 저장
         </Button>
      </div>

      {/* Progress Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">{progressMsg}</h2>
            <p className="text-gray-400 mb-6 text-sm font-mono">처리하는 동안 브라우저를 닫지 마세요</p>
            {progress > 0 && (
                <div className="w-80">
                    <div className="flex justify-between text-xs text-blue-300 mb-1">
                        <span>진행률</span>
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