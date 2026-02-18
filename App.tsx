import React, { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { LoopEditor } from './components/LoopEditor';
import { ContactForm } from './components/ContactForm';
import { AdUnit } from './components/AdUnit';
import { SeoContent } from './components/SeoContent';
import { LegalInfo } from './components/LegalInfo';
import { Infinity, Globe, Menu, X } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'privacy' | 'terms' }>({ isOpen: false, type: 'privacy' });
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    }
  };

  const openLegal = (type: 'privacy' | 'terms') => {
    setLegalModal({ isOpen: true, type });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/50 border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setFile(null); window.scrollTo(0,0); }}>
                <Infinity className="w-8 h-8 text-blue-500" />
                <span className="font-bold text-lg hidden md:block tracking-tight">Seamless Loop</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                <button onClick={() => { setFile(null); window.scrollTo(0,0); }} className="hover:text-white transition-colors">{t.nav.home}</button>
                <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">{t.nav.about}</button>
                <button onClick={() => scrollToSection('guide')} className="hover:text-white transition-colors">{t.nav.blog}</button>
                <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">{t.nav.contact}</button>
            </nav>

            <div className="flex items-center gap-4">
                <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                >
                <Globe className="w-3.5 h-3.5 text-gray-300" />
                <span>{language === 'ko' ? 'EN' : 'KO'}</span>
                </button>
                
                {/* Mobile Menu Toggle */}
                <button className="md:hidden p-2 text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                </button>
            </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
             <div className="md:hidden bg-[#1e1e1e] border-b border-white/10 animate-in slide-in-from-top-2">
                <div className="flex flex-col p-4 space-y-4 text-sm font-medium text-gray-300">
                    <button onClick={() => { setFile(null); window.scrollTo(0,0); setIsMenuOpen(false); }}>{t.nav.home}</button>
                    <button onClick={() => scrollToSection('about')}>{t.nav.about}</button>
                    <button onClick={() => scrollToSection('guide')}>{t.nav.blog}</button>
                    <button onClick={() => scrollToSection('contact')}>{t.nav.contact}</button>
                </div>
             </div>
        )}
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 flex-grow">
        
        {/* Top Ad Banner */}
        <AdUnit className="max-w-4xl mx-auto" />

        {!file ? (
          <div className="flex flex-col h-full max-w-5xl mx-auto animate-fade-in">
             {/* Hero Section */}
             <section id="home" className="text-center py-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
                  {t.app.title}
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                   {t.app.subtitle}
                </p>
             </section>

             <VideoUploader onFileSelect={setFile} />
             
             {/* Middle Ad Unit */}
             <AdUnit className="max-w-2xl mx-auto my-12" />
             
             {/* Rich SEO Content */}
             <div id="guide">
                 <SeoContent />
             </div>

             <div id="contact">
                 <ContactForm />
             </div>
          </div>
        ) : (
          <div className="animate-fade-in">
              <LoopEditor file={file} onBack={() => setFile(null)} />
              <AdUnit className="max-w-5xl mx-auto mt-8" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 py-12 mt-20 relative z-10">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 opacity-80">
                    <Infinity className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-300">Seamless Loop</span>
                </div>
                
                <div className="flex gap-6 text-sm text-gray-500">
                    <button onClick={() => openLegal('privacy')} className="hover:text-gray-300 transition-colors">{t.nav.privacy}</button>
                    <button onClick={() => openLegal('terms')} className="hover:text-gray-300 transition-colors">{t.nav.terms}</button>
                    <button onClick={() => scrollToSection('contact')} className="hover:text-gray-300 transition-colors">{t.nav.contact}</button>
                </div>
            </div>
            <div className="mt-8 text-center text-xs text-gray-600">
                <p>{t.app.footer}</p>
            </div>
        </div>
      </footer>

      {/* Legal Modals */}
      <LegalInfo 
        isOpen={legalModal.isOpen} 
        onClose={() => setLegalModal(p => ({...p, isOpen: false}))} 
        type={legalModal.type} 
      />

    </div>
  );
}