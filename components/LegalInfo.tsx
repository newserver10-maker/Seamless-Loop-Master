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
            {type === 'privacy' ? "개인정보처리방침 (Privacy Policy)" : "이용약관 (Terms of Service)"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto text-sm text-gray-300 leading-relaxed space-y-6 custom-scrollbar">
          {type === 'privacy' ? (
            <>
              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제1조 (총칙)</h3>
                  <p>QPERATION Creative IP Group(이하 "회사")은 사용자의 개인정보보호를 매우 중요시하며, 「개인정보보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」을 준수하고 있습니다.</p>
              </div>
              
              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제2조 (영상 데이터의 비수집 원칙)</h3>
                  <p className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg text-blue-100">
                    <strong>핵심 고지:</strong> 본 "심리스 루프 마스터" 서비스는 100% 클라이언트 사이드(Client-Side) 기술(WebAssembly 등)을 사용하여 동작합니다. 사용자가 업로드하는 모든 동영상 및 이미지 파일은 사용자의 브라우저 내에서만 처리되며, 회사의 서버로 전송되거나 저장되지 않습니다.
                  </p>
              </div>

              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제3조 (수집하는 개인정보 항목 및 목적)</h3>
                  <p>회사는 서비스 제공을 위해 아래와 같은 최소한의 정보를 수집합니다.</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-400">
                      <li><strong>문의하기:</strong> 이메일 주소, 이름 (목적: 고객 문의 응대 및 처리 결과 회신)</li>
                      <li><strong>자동 수집:</strong> 쿠키(Cookie), 접속 로그, 서비스 이용 기록 (목적: 서비스 안정성 확보 및 부정 이용 방지)</li>
                  </ul>
              </div>
              
              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제4조 (쿠키의 운용 및 광고 게재)</h3>
                  <p>회사는 Google AdSense를 포함한 제3자 광고 사업자를 통해 웹사이트에 광고를 게재합니다.</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-400">
                      <li>Google 및 파트너사는 쿠키(Cookie)를 사용하여 사용자의 과거 방문 기록을 기반으로 맞춤형 광고를 제공할 수 있습니다.</li>
                      <li>사용자는 Google 광고 설정(Ads Settings)을 통해 맞춤형 광고 수신을 거부할 수 있습니다.</li>
                  </ul>
              </div>

              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제5조 (개인정보 보호책임자)</h3>
                  <p>회사는 개인정보 처리에 관한 업무를 총괄하고, 이와 관련한 고충 처리를 위해 아래와 같이 책임자를 지정하고 있습니다.</p>
                  <p className="mt-2 text-gray-400">
                    - 책임 부서: QPERATION 보안팀<br/>
                    - 연락처: info@qperation.com
                  </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제1조 (목적)</h3>
                  <p>이 약관은 QPERATION Creative IP Group(이하 "회사")이 제공하는 "심리스 루프 마스터" 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 회원의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
              </div>

              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제2조 (서비스의 제공 및 변경)</h3>
                  <p>본 서비스는 웹 브라우저 기반의 미디어 편집 도구를 무료로 제공합니다. 회사는 기술적 필요에 따라 서비스의 내용을 변경하거나 중단할 수 있으며, 이로 인해 발생하는 사용자의 데이터 손실에 대해서는 책임지지 않습니다. (모든 데이터는 사용자 로컬 기기에만 존재합니다.)</p>
              </div>
              
              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제3조 (저작권 및 이용권)</h3>
                  <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-400">
                      <li><strong>사용자 콘텐츠:</strong> 사용자가 서비스를 통해 제작한 결과물(루프 영상 등)의 저작권은 전적으로 사용자에게 귀속됩니다. 회사는 이에 대한 어떠한 권리도 주장하지 않습니다.</li>
                      <li><strong>책임 제한:</strong> 사용자는 타인의 저작권을 침해하는 영상을 업로드해서는 안 되며, 이로 인해 발생하는 모든 법적 책임은 사용자 본인에게 있습니다.</li>
                  </ul>
              </div>

              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제4조 (면책 조항)</h3>
                  <p>회사는 천재지변, 인터넷 장애, 사용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다. 또한, 무료로 제공되는 서비스의 특성상 서비스 이용과 관련하여 발생한 어떠한 손해에 대해서도 책임을 지지 않습니다.</p>
              </div>

              <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">제5조 (준거법 및 관할)</h3>
                  <p>본 약관의 해석 및 분쟁 해결에는 대한민국 법률을 적용하며, 관할 법원은 회사의 본사 소재지를 관할하는 법원으로 합니다.</p>
              </div>
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