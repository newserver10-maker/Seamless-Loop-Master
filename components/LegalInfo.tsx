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
              <h3 className="text-lg font-semibold text-white mt-2">1. 개인정보 처리방침 (Privacy Policy)</h3>
              <p>심리스 루프 마스터(Seamless Loop Master, 이하 "서비스")는 사용자의 개인정보를 최우선으로 보호하며, 다음과 같은 정책을 준수합니다.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">2. 데이터 처리 방식 (Client-Side Processing)</h3>
              <p>본 서비스는 <strong>서버리스(Serverless) 및 클라이언트 사이드 프로세싱</strong> 기술을 기반으로 운영됩니다. 사용자가 업로드하는 모든 동영상 및 미디어 파일은 사용자의 디바이스(브라우저) 내에서만 처리되며, 어떠한 경우에도 외부 서버로 전송되거나 저장되지 않습니다. 따라서 서비스 제공자는 사용자의 원본 데이터에 접근할 수 없습니다.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">3. 수집하는 정보 및 쿠키 (Cookies)</h3>
              <p>서비스는 회원가입을 요구하지 않으며, 이름이나 전화번호 같은 개인 식별 정보를 수집하지 않습니다. 단, 서비스 개선 및 광고 게재를 위해 다음과 같은 기술적 정보가 수집될 수 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Google AdSense:</strong> 광고 게재를 위해 Google 및 파트너사는 사용자의 방문 기록을 바탕으로 쿠키(Cookie)를 사용할 수 있습니다. 사용자는 Google 광고 설정에서 맞춤형 광고를 해제할 수 있습니다.</li>
                  <li><strong>Google Analytics:</strong> 서비스 이용 통계(방문자 수, 체류 시간 등) 분석을 위해 익명의 데이터가 수집될 수 있습니다.</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4">4. 문의하기 (Contact)</h3>
              <p>사용자가 이메일 문의 기능을 이용할 경우, 회신을 위해 이메일 주소와 이름이 일시적으로 수집될 수 있으며, 목적 달성 후 즉시 파기됩니다.</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-white mt-2">1. 서비스 이용 약관 (Terms of Service)</h3>
              <p>본 약관은 심리스 루프 마스터 웹사이트 이용에 관한 제반 사항을 규정합니다.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">2. 서비스의 제공 및 변경</h3>
              <p>본 서비스는 사용자에게 무료로 제공되는 영상 편집 도구입니다. 운영상, 기술상의 필요에 따라 사전 공지 없이 서비스의 내용이 변경되거나 중단될 수 있습니다.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">3. 저작권 및 사용권</h3>
              <p>사용자가 본 도구를 사용하여 제작한 영상 결과물(Output)에 대한 저작권은 전적으로 사용자에게 귀속됩니다. 서비스 제공자는 사용자가 제작한 콘텐츠에 대해 어떠한 권리도 주장하지 않습니다.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4">4. 책임의 한계</h3>
              <p>본 서비스는 "있는 그대로(As-Is)" 제공됩니다. 서비스 이용 과정에서 발생하는 데이터 손실, 디바이스 오류, 또는 제작된 영상의 사용으로 인한 법적 분쟁에 대해 서비스 제공자는 책임을 지지 않습니다.</p>
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