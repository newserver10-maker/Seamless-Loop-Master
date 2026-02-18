import React, { useState } from 'react';
import { Button } from './Button';
import { Send, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mwvnveob", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-green-500/30 text-center max-w-2xl mx-auto mt-16 animate-fade-in shadow-lg">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t.contact.successTitle}</h3>
        <p className="text-gray-400">{t.contact.successDesc}</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-blue-400 hover:text-blue-300 underline"
        >
          {t.contact.retryBtn}
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto mt-20 px-4">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-200 mb-2 flex items-center justify-center gap-2">
                <Mail className="w-6 h-6 text-blue-500" />
                {t.contact.title}
            </h2>
            <p className="text-gray-400 text-sm">{t.contact.desc}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e1e1e] p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-medium text-gray-400 ml-1">{t.contact.nameLabel}</label>
                    <input 
                        required 
                        type="text" 
                        name="name" 
                        id="name"
                        placeholder={t.contact.namePlace}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-medium text-gray-400 ml-1">{t.contact.emailLabel}</label>
                    <input 
                        required 
                        type="email" 
                        name="email" 
                        id="email"
                        placeholder={t.contact.emailPlace}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>
            
            <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-medium text-gray-400 ml-1">{t.contact.msgLabel}</label>
                <textarea 
                    required 
                    name="message" 
                    id="message"
                    rows={4}
                    placeholder={t.contact.msgPlace}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
            </div>

            {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t.contact.errorMsg}</span>
                </div>
            )}

            <Button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full h-12 text-base font-semibold mt-2"
                icon={status === 'submitting' ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2"/> : <Send className="w-4 h-4" />}
            >
                {status === 'submitting' ? t.contact.sending : t.contact.sendBtn}
            </Button>
        </form>
    </section>
  );
};