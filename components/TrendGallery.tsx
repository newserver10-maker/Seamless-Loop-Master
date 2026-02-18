import React, { useState, useRef, useEffect } from 'react';
import { Play, Zap, Info, Loader2, VideoOff, Search, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoItem {
  id: number;
  videoUrl: string;
  posterUrl: string;
  title: string;
  creator: string;
  category: 'nature' | 'city' | 'abstract';
  analysis: {
    ko: string;
    en: string;
  };
}

// Optimized List: Removed unstable vertical videos to guarantee 100% uptime
const TREND_VIDEOS: VideoItem[] = [
  {
    id: 1,
    category: 'nature',
    videoUrl: "https://videos.pexels.com/video-files/1536322/1536322-hd_1920_1080_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/1536322/free-video-1536322.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Mystic Forest",
    creator: "NatureVibe",
    analysis: {
      ko: "이 풍경 영상은 픽셀 매칭(Type B)을 통해 나뭇잎의 흔들림을 끊김 없이 연결하여 자연스러운 ASMR 효과를 극대화했습니다.",
      en: "This landscape video uses pixel matching (Type B) to seamlessly connect leaf movements, maximizing natural ASMR effects."
    }
  },
  {
    id: 2,
    category: 'abstract',
    videoUrl: "https://videos.pexels.com/video-files/3163534/3163534-hd_1920_1080_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/3163534/free-video-3163534.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Ink Flow",
    creator: "MotionLab",
    analysis: {
      ko: "마이크로 크로스페이드를 적용하여 기하학적 패턴의 색상 변화를 부드럽게 루프 처리, 시각적 몰입도를 높였습니다.",
      en: "Applied micro-crossfade to smoothly loop color transitions in geometric patterns, enhancing visual immersion."
    }
  },
  {
    id: 3,
    category: 'city',
    videoUrl: "https://videos.pexels.com/video-files/2053100/2053100-hd_1920_1080_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/2053100/free-video-2053100.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Night Velocity",
    creator: "UrbanLens",
    analysis: {
      ko: "0.1초 단위의 미세 조정으로 자동차의 이동 궤적(Light Trails)을 인위적인 툭 끊김 없이 완벽하게 완성했습니다.",
      en: "Perfectly completed vehicle light trails without artificial cuts through 0.1s micro-adjustments."
    }
  }
];

const TrendVideoCard = ({ item }: { item: VideoItem }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (videoRef.current && !isError) {
                            videoRef.current.play().catch(() => {
                                setIsPlaying(false);
                            });
                            setIsPlaying(true);
                        }
                    } else {
                        if (videoRef.current) {
                            videoRef.current.pause();
                            setIsPlaying(false);
                        }
                    }
                });
            },
            { threshold: 0.4 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [isError]);

    const handleError = () => {
        console.warn(`Video load error for ${item.title}`);
        setIsError(true);
        setIsLoading(false);
    };

    return (
        <div className="group relative flex flex-col bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20 h-full animate-in fade-in zoom-in duration-500">
            {/* Aspect Ratio Container - Standard 16:9 for reliability */}
            <div className="relative aspect-video overflow-hidden bg-black">
                
                {!isError ? (
                    <video
                        ref={videoRef}
                        src={item.videoUrl}
                        poster={item.posterUrl}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onLoadedData={() => setIsLoading(false)}
                        onError={handleError}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500 space-y-3 p-4 text-center border-b border-white/5">
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                            <VideoOff className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-600">Preview Unavailable</p>
                        </div>
                    </div>
                )}
                
                {isLoading && !isError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

                {!isError && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-white/90 text-[10px] font-bold flex items-center gap-1 z-20">
                        {isPlaying ? <Play className="w-3 h-3 fill-current text-green-400" /> : <Play className="w-3 h-3 fill-current text-gray-400" />}
                        <span>{isPlaying ? 'LIVE' : 'READY'}</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">by {item.creator}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-2 uppercase tracking-wide">
                        <Zap className="w-3 h-3" />
                        AI Analysis
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {language === 'ko' ? item.analysis.ko : item.analysis.en}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const TrendGallery = () => {
  const { t } = useLanguage();

  const handleSearchTrends = () => {
    // Open Google Video Search for seamless loops
    window.open("https://www.google.com/search?q=seamless+loop+video+background+4k&tbm=vid", "_blank");
  };

  return (
    <section id="gallery" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
            {t.gallery.title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t.gallery.desc}
          </p>
        </div>

        <div className="masonry-grid">
          {TREND_VIDEOS.map((item) => (
             <TrendVideoCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={handleSearchTrends}
            className="group px-8 py-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 hover:from-blue-800/50 hover:to-purple-800/50 text-white rounded-full font-bold transition-all border border-white/10 flex items-center gap-3 mx-auto shadow-lg hover:shadow-blue-900/20"
          >
            <Search className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>{t.gallery.viewMore} (Google Search)</span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
          <p className="mt-4 text-xs text-gray-500">
            * 클릭 시 구글 '심리스 루프 비디오' 검색 결과로 이동합니다.
          </p>
        </div>
      </div>
    </section>
  );
};