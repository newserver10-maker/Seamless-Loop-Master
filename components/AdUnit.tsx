import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const AdUnit = ({ className = "" }: { className?: string }) => {
  const { t } = useLanguage();

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className={`w-full bg-[#1e1e1e] border border-white/5 rounded-lg overflow-hidden my-6 p-4 text-center ${className}`}>
      <div className="text-xs text-gray-600 mb-2 uppercase tracking-wider">{t.ad.label}</div>
      {/* Responsive Display Ad Unit */}
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-2474795707346572"
           data-ad-slot="auto"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      
      {/* Fallback placeholder for development/preview when ads aren't loading */}
      <div className="hidden peer-empty:flex h-32 items-center justify-center bg-black/20 rounded border border-dashed border-gray-700">
         <span className="text-gray-500 text-sm">Google AdSense Space</span>
      </div>
    </div>
  );
};