import React, { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { LoopEditor } from './components/LoopEditor';
import { ContactForm } from './components/ContactForm';
import { Infinity, Globe } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-blue-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Language Toggle Button */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full px-4 py-2 text-sm font-medium transition-all backdrop-blur-sm"
        >
          <Globe className="w-4 h-4 text-gray-300" />
          <span className="text-gray-200">{language === 'ko' ? 'English' : '한국어'}</span>
        </button>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 h-full">
        {!file ? (
          <div className="flex flex-col h-full max-w-4xl mx-auto">
             <header className="flex items-center justify-center gap-3 mb-12 mt-10">
                <Infinity className="w-10 h-10 text-blue-500" />
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {t.app.title}
                </h1>
             </header>
             <VideoUploader onFileSelect={setFile} />
             
             <ContactForm />

             <footer className="mt-12 text-center text-gray-500 text-sm pb-8">
                <p>{t.app.footer}</p>
             </footer>
          </div>
        ) : (
          <LoopEditor file={file} onBack={() => setFile(null)} />
        )}
      </main>
    </div>
  );
}