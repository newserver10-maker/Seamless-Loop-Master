import React, { useState, useRef, useEffect } from 'react';
import { Play, Zap, Info, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoItem {
  id: number;
  videoUrl: string;
  fallbackUrl: string;
  title: string;
  creator: string;
  category: 'nature' | 'city' | 'abstract';
  analysis: {
    ko: string;
    en: string;
  };
}

// Curated High-Quality Sources with Fallbacks (Pexels Stable Links)
const TREND_VIDEOS: VideoItem[] = [
  {
    id: 1,
    category: 'nature',
    // Forest/Leaves
    videoUrl: "https://videos.pexels.com/video-files/1536322/1536322-hd_1920_1080_30fps.mp4",
    fallbackUrl: "https://videos.pexels.com/video-files/1536322/1536322-sd_640_360_30fps.mp4", 
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
    // Abstract Ink/Pattern
    videoUrl: "https://videos.pexels.com/video-files/2759484/2759484-hd_1920_1080_30fps.mp4",
    fallbackUrl: "https://videos.pexels.com/video-files/2759484/2759484-sd_640_360_30fps.mp4",
    title: "Liquid Art",
    creator: "MotionLab",
    analysis: {
      ko: "마이크로 크로스페이드를 적용하여 기하학적 패턴의 색상 변화를 부드럽게 루프 처리, 시각적 몰입도를 높였습니다.",
      en: "Applied micro-crossfade to smoothly loop color transitions in geometric patterns, enhancing visual immersion."
    }
  },
  {
    id: 3,
    category: 'city',
    // City Traffic
    videoUrl: "https://videos.pexels.com/video-files/2053100/2053100-hd_1920_1080_30fps.mp4",
    fallbackUrl: "https://videos.pexels.com/video-files/2053100/2053100-sd_640_360_30fps.mp4",
    title: "Night Velocity",
    creator: "UrbanLens",
    analysis: {
      ko: "0.1초 단위의 미세 조정으로 자동차의 이동 궤적(Light Trails)을 인위적인 툭 끊김 없이 완벽하게 완성했습니다.",
      en: "Perfectly completed vehicle light trails without artificial cuts through 0.1s micro-adjustments."
    }
  },
  {
    id: 4,
    category: 'nature',
    // Water/Ocean
    videoUrl: "https://videos.pexels.com/video-files/855018/855018-hd_1920_1080_30fps.mp4",
    fallbackUrl: "https://videos.pexels.com/video-files/855018/855018-sd_640_360_30fps.mp4",
    title: "Infinite Waves",
    creator: "BlueMind",
    analysis: {
      ko: "파도의 불규칙한 주기를 Type A 모드로 보정하고 오디오 레벨을 정규화하여 편안한 루프를 구현했습니다.",
      en: "Corrected irregular wave cycles with Type A mode and normalized audio levels for a relaxing loop."
    }
  },
  {
    id: 5,
    category: 'abstract',
    // Tech/Neon
    videoUrl: "https://videos.pexels.com/video-files/2603664/2603664-hd_1920_1080_30fps.mp4",
    fallbackUrl: "https://videos.pexels.com/video-files/2603664/2603664-sd_640_360_30fps.mp4",
    title: "Cyber Rain",
    creator: "NeonFuture",
    analysis: {
      ko: "빗줄기의 속도감을 유지하기 위해 페이드 시간을 0.2초로 짧게 설정, 스피디하고 역동적인 루프를 생성했습니다.",
      en: "Set fade duration to 0.2s to maintain rain speed, creating a fast and dynamic loop."
    }
  },
  {
    id: 6,
    category: 'city',
    // Coffee/Cafe
    videoUrl: "https://videos.pexels.com/video-files/4109404/4109404-hd_1920_1080_25fps.mp4",
    fallbackUrl: "https://videos.pexels.com/video-files/4109404/4109404-sd_640_360_25fps.mp4",
    title: "Morning Steam",
    creator: "DailyLife",
    analysis: {
      ko: "증기의 상승 패턴을 AI가 분석하여, 하단부는 고정하고 상단부만 자연스럽게 페이드되는 마스크 기법을 적용했습니다.",
      en: "AI analyzed steam patterns, applying a mask technique to fade only the top while keeping the bottom static."
    }
  }
];

const TrendVideoCard = ({ item }: { item: VideoItem }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const { language } = useLanguage();

    // Lazy Load Implementation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (videoRef.current) {
                            videoRef.current.play().catch(() => {
                                // Autoplay might be blocked or low power mode
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
            { threshold: 0.4 } // Play when 40% visible
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const handleError = () => {
        if (videoRef.current && !isError) {
            console.warn(`Video load error for ${item.title}, trying fallback...`);
            setIsError(true);
            // Fallback strategy
            if (item.fallbackUrl && videoRef.current.src !== item.fallbackUrl) {
                 videoRef.current.src = item.fallbackUrl;
                 videoRef.current.load();
            }
        }
    };

    return (
        <div className="group relative flex flex-col bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20">
            {/* Video Container */}
            <div className="relative aspect-[9/16] md:aspect-[4/5] overflow-hidden bg-black">
                <video
                    ref={videoRef}
                    src={item.videoUrl}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    muted
                    loop
                    playsInline
                    preload="none"
                    onLoadedData={() => setIsLoading(false)}
                    onError={handleError}
                />
                
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                )}

                {/* Error State Fallback UI (if both fail) */}
                {isError && isLoading && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20 text-gray-500">
                        <AlertCircle className="w-8 h-8 mb-2" />
                        <span className="text-xs">Preview Unavailable</span>
                    </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

                {/* Status Indicator */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-white/90 text-[10px] font-bold flex items-center gap-1">
                    {isPlaying ? <Play className="w-3 h-3 fill-current text-green-400" /> : <Play className="w-3 h-3 fill-current text-gray-400" />}
                    <span>{isPlaying ? 'LIVE' : 'READY'}</span>
                </div>
            </div>

            {/* Content & Analysis */}
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

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium transition-colors border border-white/10 flex items-center gap-2 mx-auto">
            <Info className="w-4 h-4" />
            {t.gallery.viewMore}
          </button>
        </div>
      </div>
    </section>
  );
};