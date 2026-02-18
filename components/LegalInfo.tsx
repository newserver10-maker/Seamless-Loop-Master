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
              <h3 className="text-lg font-semibold text-white">1. 개인정보 처리방침 개요</h3>
              <p>심리스 루프 마스터(이하 "서비스")는 사용자의 개인정보를 소중히 다루며, 관련 법령을 준수합니다. 본 서비스는 <strong>서버리스(Serverless)</strong> 아키텍처를 기반으로 하여, 사용자가 업로드한 동영상 파일이 외부 서버로 전송되거나 저장되지 않고 사용자의 브라우저 내에서만 처리됨을 명확히 고지합니다.</p>
              
              <h3 className="text-lg font-semibold text-white">2. 수집하는 개인정보 항목</h3>
              <p>본 서비스는 회원가입 기능을 제공하지 않으며, 이용자의 성명, 전화번호 등 식별 가능한 개인정보를 수집하지 않습니다. 단, 문의하기(Contact Form) 기능을 이용할 경우 이메일 주소와 이름이 수집될 수 있으며 이는 문의 응대 목적으로만 사용됩니다.</p>
              
              <h3 className="text-lg font-semibold text-white">3. 쿠키(Cookie) 및 광고 식별자</h3>
              <p>서비스 이용 편의성과 구글 애드센스(Google AdSense) 광고 게재를 위해 쿠키가 사용될 수 있습니다. 사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-white">1. 서비스 이용 약관</h3>
              <p>본 약관은 심리스 루프 마스터가 제공하는 영상 편집 도구의 이용 조건 및 절차를 규정합니다.</p>
              
              <h3 className="text-lg font-semibold text-white">2. 저작권 및 책임</h3>
              <p>사용자가 편집하는 영상의 원본 저작권은 사용자에게 있습니다. 본 서비스를 통해 제작된 결과물의 사용으로 인해 발생하는 저작권 침해 분쟁이나 손해에 대해 서비스 제공자는 법적 책임을 지지 않습니다.</p>
              
              <h3 className="text-lg font-semibold text-white">3. 서비스의 변경 및 중단</h3>
              <p>본 서비스는 무료로 제공되며, 운영상의 목적에 따라 예고 없이 기능이 변경되거나 서비스가 중단될 수 있습니다.</p>
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