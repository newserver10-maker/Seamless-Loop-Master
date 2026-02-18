import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       // Filter for video
       if (e.dataTransfer.files[0].type.startsWith('video/')) {
         onFileSelect(e.dataTransfer.files[0]);
       } else {
         alert(t.uploader.error);
       }
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-gray-700 rounded-3xl bg-[#1e1e1e]/50 hover:bg-[#1e1e1e] transition-colors gap-6 p-10 cursor-pointer group"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Upload className="w-10 h-10 text-blue-400" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">{t.uploader.title}</h2>
        <p className="text-gray-400">{t.uploader.desc}</p>
      </div>
      <input 
        ref={inputRef}
        type="file" 
        accept="video/*" 
        className="hidden" 
        onChange={handleFileChange}
      />
      <Button>{t.uploader.btn}</Button>
    </div>
  );
};