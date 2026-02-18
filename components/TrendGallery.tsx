import React, { useState, useRef, useEffect } from 'react';
import { Play, Zap, Info, Loader2, VideoOff } from 'lucide-react';
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

// Curated High-Reliability Sources (Pexels Verified URLs)
// Updated items 4, 5, 6 to stable vertical videos
const TREND_VIDEOS: VideoItem[] = [
  {
    id: 1,
    category: 'nature',
    // Forest/Leaves - High stability
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
    // Ink - High stability
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
    // Traffic - High stability
    videoUrl: "https://videos.pexels.com/video-files/2053100/2053100-hd_1920_1080_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/2053100/free-video-2053100.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
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
    // Ocean/Vertical - Replaced with reliable link
    videoUrl: "https://videos.pexels.com/video-files/5091624/5091624-hd_1080_1920_24fps.mp4",
    posterUrl: "https://images.pexels.com/videos/5091624/free-video-5091624.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Vertical Waves",
    creator: "BlueMind",
    analysis: {
      ko: "파도의 불규칙한 주기를 Type A 모드로 보정하고 오디오 레벨을 정규화하여 편안한 힐링 루프를 구현했습니다.",
      en: "Corrected irregular wave cycles with Type A mode and normalized audio levels for a relaxing healing loop."
    }
  },
  {
    id: 5,
    category: 'abstract',
    // Neon/Abstract Vertical - Replaced with reliable link
    videoUrl: "https://videos.pexels.com/video-files/3121459/3121459-hd_1080_1920_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/3121459/free-video-3121459.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Neon Tunnel",
    creator: "NeonFuture",
    analysis: {
      ko: "빛의 이동 속도를 일정하게 유지하기 위해 페이드 시간을 0.2초로 짧게 설정, 몰입감 높은 무한 공간을 연출했습니다.",
      en: "Set fade duration to 0.2s to maintain constant light speed, creating a highly immersive infinite space."
    }
  },
  {
    id: 6,
    category: 'city',
    // Coffee/Vertical - Replaced with reliable link
    videoUrl: "https://videos.pexels.com/video-files/3052281/3052281-hd_1080_1920_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/3052281/free-video-3052281.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Morning Pour",
    creator: "DailyLife",
    analysis: {
      ko: "액체가 떨어지는 속도와 컵에 차오르는 높이를 계산하여, 루프 지점에서의 위화감을 최소화한 시네마그래프입니다.",
      en: "A cinemagraph that minimizes dissonance at the loop point by calculating pouring speed and fill level."
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

    // Self-destruct logic: If error, hide the card to maintain gallery integrity
    if (isError) return null;

    return (
        <div className="group relative flex flex-col bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20 h-full animate-in fade-in zoom-in duration-500">
            <div className="relative aspect-[9/16] md:aspect-[4/5] overflow-hidden bg-black">
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
                
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-white/90 text-[10px] font-bold flex items-center gap-1 z-20">
                    {isPlaying ? <Play className="w-3 h-3 fill-current text-green-400" /> : <Play className="w-3 h-3 fill-current text-gray-400" />}
                    <span>{isPlaying ? 'LIVE' : 'READY'}</span>
                </div>
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