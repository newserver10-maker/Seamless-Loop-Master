import React, { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { LoopEditor } from './components/LoopEditor';
import { ContactForm } from './components/ContactForm';
import { AdUnit } from './components/AdUnit';
import { SeoContent } from './components/SeoContent';
import { LegalInfo } from './components/LegalInfo';
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
        // Adjust for sticky header
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

  const HowToCard = ({ icon, step, title, desc }: { icon: React.ReactNode, step: string, title: string, desc: string }) => (
    <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/5 flex flex-col items-center text-center hover:border-blue-500/30 transition-colors">
        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-4">
            {icon}
        </div>
        <div className="text-xs font-bold text-blue-500 mb-1 uppercase tracking-wider">{step}</div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Sticky Header / Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/80 border-b border-white/5 shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setFile(null); window.scrollTo(0,0); }}>
                <Infinity className="w-8 h-8 text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-bold text-lg hidden md:block tracking-tight">Seamless Loop</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                <button onClick={() => { setFile(null); window.scrollTo(0,0); }} className="hover:text-white hover:text-blue-400 transition-colors">{t.nav.home}</button>
                <button onClick={() => scrollToSection('howto')} className="hover:text-white hover:text-blue-400 transition-colors">{t.nav.howTo}</button>
                <button onClick={() => scrollToSection('guide')} className="hover:text-white hover:text-blue-400 transition-colors">{t.nav.guide}</button>
                <button onClick={() => scrollToSection('faq')} className="hover:text-white hover:text-blue-400 transition-colors">{t.nav.faq}</button>
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
             <div className="md:hidden bg-[#1e1e1e] border-b border-white/10 animate-in slide-in-from-top-2 absolute w-full left-0">
                <div className="flex flex-col p-4 space-y-4 text-sm font-medium text-gray-300">
                    <button onClick={() => { setFile(null); window.scrollTo(0,0); setIsMenuOpen(false); }}>{t.nav.home}</button>
                    <button onClick={() => scrollToSection('howto')}>{t.nav.howTo}</button>
                    <button onClick={() => scrollToSection('guide')}>{t.nav.guide}</button>
                    <button onClick={() => scrollToSection('faq')}>{t.nav.faq}</button>
                </div>
             </div>
        )}
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 flex-grow">
        
        {/* Top Ad Banner */}
        <AdUnit className="max-w-4xl mx-auto mb-8" />

        {!file ? (
          <div className="flex flex-col h-full max-w-5xl mx-auto animate-fade-in">
             {/* Hero Section */}
             <section id="home" className="text-center py-12 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400 pb-2">
                  {t.app.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                   {t.app.subtitle}
                </p>
             </section>

             {/* Main Tool */}
             <VideoUploader onFileSelect={setFile} />
             
             {/* How To Use Section */}
             <section id="howto" className="py-20">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white mb-2">{t.howto.title}</h2>
                    <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <HowToCard 
                        icon={<MousePointerClick className="w-6 h-6"/>} 
                        step="Step 1" 
                        title={t.howto.step1} 
                        desc={t.howto.step1Desc} 
                    />
                    <HowToCard 
                        icon={<Settings2 className="w-6 h-6"/>} 
                        step="Step 2" 
                        title={t.howto.step2} 
                        desc={t.howto.step2Desc} 
                    />
                    <HowToCard 
                        icon={<Download className="w-6 h-6"/>} 
                        step="Step 3" 
                        title={t.howto.step3} 
                        desc={t.howto.step3Desc} 
                    />
                </div>
             </section>

             {/* Middle Ad Unit */}
             <AdUnit className="max-w-3xl mx-auto my-4" />
             
             {/* Rich SEO Content & FAQ */}
             <div id="guide">
                 <SeoContent />
             </div>

             <div id="contact" className="border-t border-white/5 pt-10 mt-10">
                 <ContactForm />
             </div>
          </div>
        ) : (
          <div className="animate-fade-in">
              <LoopEditor file={file} onBack={() => setFile(null)} />
              <AdUnit className="max-w-5xl mx-auto mt-12" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 py-12 mt-20 relative z-10">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <Infinity className="w-6 h-6 text-blue-500" />
                        <span className="font-bold text-xl text-white">Seamless Loop</span>
                    </div>
                    <p className="text-sm text-gray-500 max-w-xs">
                        {t.app.footer}
                    </p>
                </div>
                
                <div>
                    <h4 className="font-semibold text-white mb-4">Service</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><button onClick={() => { setFile(null); window.scrollTo(0,0); }} className="hover:text-blue-400">{t.nav.home}</button></li>
                        <li><button onClick={() => scrollToSection('howto')} className="hover:text-blue-400">{t.nav.howTo}</button></li>
                        <li><button onClick={() => scrollToSection('guide')} className="hover:text-blue-400">{t.nav.guide}</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-white mb-4">Legal & Support</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><button onClick={() => openLegal('privacy')} className="hover:text-blue-400">{t.nav.privacy}</button></li>
                        <li><button onClick={() => openLegal('terms')} className="hover:text-blue-400">{t.nav.terms}</button></li>
                        <li><button onClick={() => scrollToSection('contact')} className="hover:text-blue-400">{t.nav.contact}</button></li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                <p>&copy; 2024 Seamless Loop Master. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <span>Privacy First</span>
                    <span>Serverless Architecture</span>
                    <span>High Performance</span>
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