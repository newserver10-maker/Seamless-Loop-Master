import React, { useState } from 'react';
import { Play, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoItem {
  id: number;
  thumbnail: string;
  videoUrl?: string; // Optional for hover preview
  title: string;
  creator: string;
}

// Curated high-quality loop-style content placeholders
const TREND_VIDEOS: VideoItem[] = [
  {
    id: 1,
    thumbnail: "https://images.pexels.com/photos/2832432/pexels-photo-2832432.png?auto=compress&cs=tinysrgb&w=600",
    videoUrl: "https://player.vimeo.com/external/371835787.sd.mp4?s=d027f6c32170b6d9e03d3c7e7f674514217143e3&profile_id=164&oauth2_token_id=57447761",
    title: "Ocean Waves Loop",
    creator: "NatureFlow"
  },
  {
    id: 2,
    thumbnail: "https://images.pexels.com/photos/1707213/pexels-photo-1707213.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoUrl: "https://player.vimeo.com/external/370331493.sd.mp4?s=e90dcaba73c19e0e36f03406b471d6048bdcca47&profile_id=164&oauth2_token_id=57447761", 
    title: "Urban Night Traffic",
    creator: "CityScape"
  },
  {
    id: 3,
    thumbnail: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoUrl: "https://player.vimeo.com/external/494291882.sd.mp4?s=82c444c1d2797e594d76632490b6c680879c8828&profile_id=164&oauth2_token_id=57447761",
    title: "Abstract Ink Flow",
    creator: "ArtMotion"
  },
  {
    id: 4,
    thumbnail: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
    videoUrl: "https://player.vimeo.com/external/330424368.sd.mp4?s=5347347a898436573c09199d2557760986e8a481&profile_id=164&oauth2_token_id=57447761",
    title: "Forest Sunlight",
    creator: "EcoVibe"
  },
  {
    id: 5,
    thumbnail: "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoUrl: "https://player.vimeo.com/external/384761655.sd.mp4?s=383ab4dbc760372333066e40d125434d38092a4a&profile_id=164&oauth2_token_id=57447761",
    title: "Coffee Steam",
    creator: "CafeMood"
  },
  {
    id: 6,
    thumbnail: "https://images.pexels.com/photos/2098428/pexels-photo-2098428.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoUrl: "https://player.vimeo.com/external/369062322.sd.mp4?s=b624d7759a24618e8749320e6f663456041a3120&profile_id=164&oauth2_token_id=57447761",
    title: "Neon Cyberpunk",
    creator: "FutureLens"
  }
];

export const TrendGallery = () => {
  const { t } = useLanguage();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-16 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            {t.gallery.title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t.gallery.desc}
          </p>
        </div>

        <div className="masonry-grid">
          {TREND_VIDEOS.map((item) => (
            <div 
              key={item.id}
              className="relative rounded-xl overflow-hidden bg-gray-800 aspect-[9/16] md:aspect-[3/4] mb-4 group cursor-pointer border border-white/5 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Thumbnail Image */}
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hoveredId === item.id ? 'opacity-0' : 'opacity-100'}`}
                loading="lazy"
              />

              {/* Video Preview (On Hover) */}
              {hoveredId === item.id && item.videoUrl && (
                <video
                  src={item.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}

              {/* Overlay Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-gray-300 text-xs">by {item.creator}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-blue-400">
                  <Play className="w-3 h-3 fill-current" />
                  {t.gallery.hoverPlay}
                </div>
              </div>

              {/* Default Icon when not hovering */}
              <div className={`absolute top-4 right-4 bg-black/40 backdrop-blur-sm p-2 rounded-full transition-opacity duration-300 ${hoveredId === item.id ? 'opacity-0' : 'opacity-100'}`}>
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium transition-colors border border-white/10">
            {t.gallery.viewMore}
          </button>
        </div>
      </div>
    </section>
  );
};