import React, { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { LoopEditor } from './components/LoopEditor';
import { ContactForm } from './components/ContactForm';
import { AdUnit } from './components/AdUnit';
import { SeoContent } from './components/SeoContent';
import { LegalInfo } from './components/LegalInfo';
import { TrendGallery } from './components/TrendGallery';
import { Infinity, Globe, Menu, X, MousePointerClick, Settings2, Download } from 'lucide-react';
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
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
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

      {/* Sticky Header / Navigation */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/90 border-b border-white/5 shadow-2xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setFile(null); window.scrollTo(0,0); }}>
                <div className="relative">
                    <Infinity className="w-8 h-8 text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <span className="font-bold text-lg hidden md:block tracking-tight">Seamless Loop</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                <button onClick={() => { setFile(null); window.scrollTo(0,0); }} className="hover:text-white hover:text-blue-400 transition-colors">{t.nav.home}</button>
                <button onClick={() => scrollToSection('gallery')} className="hover:text-white hover:text-blue-400 transition-colors flex items-center gap-1">
                    {t.nav.gallery}
                    <span className="bg-blue-600 text-[9px] px-1 rounded text-white font-bold">HOT</span>
                </button>
                <button onClick={() => scrollToSection('howto-guide')} className="hover:text-white hover:text-blue-400 transition-colors">{t.nav.howTo}</button>
                <button onClick={() => scrollToSection('column')} className="hover:text-white hover:text-blue-400 transition-colors">{t.nav.column}</button>
                <button onClick={() => openLegal('privacy')} className="hover:text-white hover:text-blue-400 transition-colors">{t.nav.privacy}</button>
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
             <div className="md:hidden bg-[#1e1e1e] border-b border-white/10 animate-in slide-in-from-top-2 absolute w-full left-0 shadow-2xl">
                <div className="flex flex-col p-4 space-y-4 text-sm font-medium text-gray-300">
                    <button onClick={() => { setFile(null); window.scrollTo(0,0); setIsMenuOpen(false); }}>{t.nav.home}</button>
                    <button onClick={() => scrollToSection('gallery')} className="flex items-center gap-2 text-blue-400 font-bold">{t.nav.gallery} <span className="text-[10px] bg-blue-600 text-white px-1 rounded">HOT</span></button>
                    <button onClick={() => scrollToSection('howto-guide')}>{t.nav.howTo}</button>
                    <button onClick={() => scrollToSection('column')}>{t.nav.column}</button>
                    <button onClick={() => openLegal('privacy')}>{t.nav.privacy}</button>
                </div>
             </div>
        )}
      </header>

      <main className="relative z-10 flex-grow">
        
        {/* Top Ad Banner (Container constrained) */}
        <div className="container mx-auto px-4">
            <AdUnit className="max-w-4xl mx-auto my-8" />
        </div>

        {!file ? (
          <div className="flex flex-col h-full animate-fade-in">
             {/* Hero Section */}
             <div className="container mx-auto px-4">
                <section id="home" className="text-center py-16 space-y-6">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-gray-500 pb-2">
                    {t.app.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                    {t.app.subtitle}
                    </p>
                </section>

                {/* Main Tool */}
                <div className="max-w-5xl mx-auto">
                    <VideoUploader onFileSelect={setFile} />
                </div>
             </div>

             {/* Real-time Trend Gallery (Full Width) */}
             <div className="mt-20">
                 <TrendGallery />
             </div>
             
             {/* Middle Ad Unit */}
             <div className="container mx-auto px-4">
                 <AdUnit className="max-w-4xl mx-auto my-12" />
             </div>

             <div className="container mx-auto px-4">
                {/* Rich SEO Content (Guide, Column, FAQ) */}
                <SeoContent />

                <div id="contact" className="border-t border-white/5 pt-16 mt-16">
                    <ContactForm />
                </div>
             </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 animate-fade-in">
              <LoopEditor file={file} onBack={() => setFile(null)} />
              <AdUnit className="max-w-5xl mx-auto mt-12" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-16 mt-20 relative z-10">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <Infinity className="w-8 h-8 text-blue-500" />
                        <span className="font-bold text-2xl text-white tracking-tight">Seamless Loop</span>
                    </div>
                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                        {t.app.footer}
                    </p>
                    <div className="flex gap-4">
                        <div className="text-xs text-gray-600">
                             Managed and Operated by <strong className="text-gray-400">QPERATION</strong><br/>
                             Creative IP Building Group
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-white mb-6 tracking-wide text-sm uppercase">Portal Menu</h4>
                    <ul className="space-y-3 text-sm text-gray-500 font-medium">
                        <li><button onClick={() => { setFile(null); window.scrollTo(0,0); }} className="hover:text-blue-400 transition-colors">{t.nav.home}</button></li>
                        <li><button onClick={() => scrollToSection('gallery')} className="hover:text-blue-400 transition-colors">{t.nav.gallery}</button></li>
                        <li><button onClick={() => scrollToSection('howto-guide')} className="hover:text-blue-400 transition-colors">{t.nav.howTo}</button></li>
                        <li><button onClick={() => scrollToSection('column')} className="hover:text-blue-400 transition-colors">{t.nav.column}</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6 tracking-wide text-sm uppercase">Policy</h4>
                    <ul className="space-y-3 text-sm text-gray-500 font-medium">
                        <li><button onClick={() => openLegal('privacy')} className="hover:text-blue-400 transition-colors">{t.nav.privacy}</button></li>
                        <li><button onClick={() => openLegal('terms')} className="hover:text-blue-400 transition-colors">{t.nav.terms}</button></li>
                        <li><button onClick={() => scrollToSection('contact')} className="hover:text-blue-400 transition-colors">{t.nav.contact}</button></li>
                    </ul>
                </div>
            </div>
            
            {/* Bottom Footer Ad */}
            <div className="border-t border-white/5 pt-8 pb-4">
                 <AdUnit className="max-w-3xl mx-auto bg-transparent border-0" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 mt-4">
                <p>&copy; 2026 QPERATION. Creative IP Building Group. All Rights Reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span>Serverless Security</span>
                    <span>WASM Tech</span>
                    <span>GDPR Compliant</span>
                    <span>Contact: info@qperation.com</span>
                </div>
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