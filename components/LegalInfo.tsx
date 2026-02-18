import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export const LegalInfo: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1e1e1e] w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl border border-white/10 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            {type === 'privacy' ? t.nav.privacy : t.nav.terms}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto text-sm text-gray-300 leading-relaxed space-y-4 custom-scrollbar">
          {type === 'privacy' ? (
            <>
              <h3 className="text-lg font-bold text-white mt-2">1. 개인정보 처리방침 (Privacy Policy)</h3>
              <p>심리스 루프 마스터(이하 "서비스")는 사용자의 개인정보 보호를 위해 최선을 다합니다.</p>
              
              <h3 className="text-lg font-bold text-white mt-4">2. 영상 데이터의 로컬 처리 (Local Processing)</h3>
              <p className="text-blue-400 font-semibold">본 서비스는 사용자의 동영상 파일을 서버로 전송하지 않습니다.</p>
              <p>모든 영상 분석(Type A/B/C) 및 렌더링 과정은 WebAssembly 기술을 통해 사용자의 브라우저(Client-Side) 내에서만 독립적으로 수행됩니다. 따라서 서비스 운영자는 귀하의 영상 원본에 기술적으로 접근할 수 없으며, 어떠한 데이터도 저장되지 않습니다.</p>
              
              <h3 className="text-lg font-bold text-white mt-4">3. 쿠키 및 광고 (Cookies & Ads)</h3>
              <p>본 사이트는 Google AdSense를 통해 광고를 게재합니다. Google은 광고 게재를 위해 사용자의 웹사이트 방문 기록을 바탕으로 쿠키(Cookie)를 사용할 수 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>사용자는 Google 광고 설정에서 맞춤형 광고를 해제할 수 있습니다.</li>
                  <li>제3자 공급업체(Google 포함)가 쿠키를 사용하여 본 웹사이트 또는 다른 웹사이트의 과거 방문을 기반으로 광고를 게재합니다.</li>
              </ul>

              <h3 className="text-lg font-bold text-white mt-4">4. 수집 정보 (Data Collection)</h3>
              <p>문의하기 기능을 이용할 때 제공되는 이메일 주소와 이름은 오직 문의 응대 목적으로만 사용되며, 목적 달성 후 파기됩니다.</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-white mt-2">1. 서비스 이용 약관 (Terms of Service)</h3>
              <p>본 약관은 2026 심리스 루프 마스터 서비스의 이용 조건을 규정합니다.</p>
              
              <h3 className="text-lg font-bold text-white mt-4">2. 서비스의 제공</h3>
              <p>본 서비스는 "있는 그대로(As-Is)" 제공되며, 브라우저 환경이나 사용자의 기기 사양에 따라 성능 차이가 발생할 수 있습니다.</p>
              
              <h3 className="text-lg font-bold text-white mt-4">3. 저작권 (Copyright)</h3>
              <p>사용자가 제작한 결과물의 저작권은 전적으로 사용자에게 있습니다. 단, 사용자가 업로드하는 원본 영상의 저작권 문제로 인해 발생하는 법적 책임은 사용자 본인에게 있습니다.</p>
            </>
          )}
        </div>
        
        <div className="p-6 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            확인 (Close)
          </button>
        </div>
      </div>
    </div>
  );
};