import React from 'react';
import { BookOpen, Cpu, TrendingUp, Layers, HelpCircle, CheckCircle2, Zap, BarChart, FileVideo, Settings, Download, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SeoContent = () => {
  const { language, t } = useLanguage();

  const ArticleCard = ({ icon, title, date, children }: { icon: React.ReactNode, title: string, date: string, children: React.ReactNode }) => (
    <article className="bg-[#1e1e1e] p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors h-full flex flex-col">
        <header className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                {icon}
                <span>{date}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{title}</h2>
        </header>
        <div className="prose prose-invert max-w-none text-gray-400 leading-7 text-sm flex-grow">
            {children}
        </div>
    </article>
  );

  return (
    <section className="max-w-7xl mx-auto mt-20 px-4 space-y-24 border-t border-white/5 pt-16">

      {/* Expert Guide Section (Visual How-To) */}
      <div id="howto-guide" className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white mb-4">
                {t.howto.title}
            </h2>
            <p className="text-gray-400">Step-by-Step Professional Guide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#121212] p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">STEP 01</div>
                  <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                      <FileVideo className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.howto.step1}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.howto.step1Desc}</p>
              </div>

              <div className="bg-[#121212] p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">STEP 02</div>
                  <div className="w-16 h-16 bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                      <Settings className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.howto.step2}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.howto.step2Desc}</p>
                  <ul className="mt-4 text-xs text-gray-500 space-y-1">
                      <li>• Type A: 풍경/배경 영상 (Crossfade)</li>
                      <li>• Type B: 복잡한 패턴 (AI Analysis)</li>
                      <li>• Type C: 댄스/액션 (Boomerang)</li>
                  </ul>
              </div>

              <div className="bg-[#121212] p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">STEP 03</div>
                  <div className="w-16 h-16 bg-green-900/20 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                      <Download className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.howto.step3}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.howto.step3Desc}</p>
              </div>
          </div>
      </div>
      
      {/* 2026 Trend Columns Section */}
      <div id="column">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">2026 Marketing Columns</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
                심리스 루프 마스터가 분석한 최신 숏폼 트렌드와 기술 전략
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Article 1: Core Trend */}
            <ArticleCard 
                icon={<TrendingUp className="w-4 h-4" />} 
                title={language === 'ko' ? "2026년 비디오 마케팅의 핵심: 심리스 루프가 체류 시간에 미치는 영향" : "2026 Core Trend: Impact of Seamless Loops on Retention"} 
                date="TREND REPORT"
            >
                <p>
                    2026년, 콘텐츠 소비 패턴은 '스낵 컬처'를 넘어 '나노 모먼트(Nano Moment)' 시대로 진입했습니다. 사용자가 콘텐츠의 가치를 판단하는 시간은 이제 1.5초에 불과합니다.
                </p>
                <p className="mt-4">
                    <strong>'끝나지 않는 영상(Never-ending Video)'</strong> 포맷은 알고리즘의 선택을 받는 가장 강력한 무기입니다. 심리스 루프는 완결점을 감춤으로써 시청자가 무의식적으로 영상을 반복 재생하게 만들어, 플랫폼 체류 시간(Dwell Time)을 평균 300% 이상 증대시킵니다.
                </p>
            </ArticleCard>

            {/* Article 2: Technical Deep Dive */}
            <ArticleCard 
                icon={<Cpu className="w-4 h-4" />} 
                title={language === 'ko' ? "AI 프레임 분석(Type B)과 마이크로 크로스페이드 기술의 원리" : "Deep Dive: AI Frame Analysis & Micro-Crossfade"} 
                date="TECH INSIGHT"
            >
                <p>
                    심리스 루프 마스터의 핵심 기술인 'Type B' 모드는 단순한 페이드 효과가 아닙니다. MSE(Mean Squared Error) 알고리즘을 브라우저 내에서 실시간으로 구동하여 최적의 프레임을 찾아냅니다.
                </p>
                <p className="mt-4">
                    WebAssembly(WASM) 기반 엔진은 영상의 첫 프레임과 가장 유사한 픽셀 패턴을 가진 마지막 프레임 구간을 0.01초 단위로 스캔하여, 비선형(Non-linear) 마이크로 크로스페이드를 적용, 글리치(Glitch) 없는 완벽한 결합을 만들어냅니다.
                </p>
            </ArticleCard>

             {/* Article 3: Innovation (New) */}
            <ArticleCard 
                icon={<Lightbulb className="w-4 h-4" />} 
                title={language === 'ko' ? "AI 기반 심리스 루프 기술이 디지털 광고에 미치는 혁신적인 영향" : "Innovative Impact of AI-based Seamless Loop Technology"} 
                date="INNOVATION"
            >
                <p>
                   단순 반복이 아닌 '지능형 루프'는 광고 피로도를 획기적으로 낮춥니다. AI가 영상의 역동적인 부분(움직임)과 정적인 부분(배경)을 분리하여 처리함으로써, 시청자는 광고를 보고 있다는 인식보다 하나의 '움직이는 예술 작품'을 감상한다는 느낌을 받게 됩니다.
                </p>
                <p className="mt-4">
                   특히 DOOH(디지털 옥외광고)와 SNS 쇼핑 피드에서 이러한 초고화질 심리스 루프 영상은 일반 영상 대비 클릭률(CTR)이 2.5배 높게 측정되고 있습니다.
                </p>
            </ArticleCard>
          </div>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="bg-black/20 p-8 rounded-3xl border border-white/5">
        <h2 className="text-2xl font-bold text-white text-center mb-8">자주 묻는 질문 (FAQ)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-500"/> 영상은 안전한가요?</h4>
                <p className="text-gray-400 text-sm">네, 100% 클라이언트 사이드(Client-Side) 처리 방식입니다. 귀하의 영상은 서버로 전송되지 않습니다.</p>
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-500"/> 화질 저하는 없나요?</h4>
                <p className="text-gray-400 text-sm">최대 4K 해상도까지 원본 화질을 유지하며 렌더링됩니다.</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-500"/> 아이폰에서도 되나요?</h4>
                <p className="text-gray-400 text-sm">네, 사파리(Safari) 및 크롬 등 모바일 브라우저를 완벽 지원합니다.</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-500"/> 상업적 이용이 가능한가요?</h4>
                <p className="text-gray-400 text-sm">본 도구로 제작된 결과물의 저작권은 100% 사용자에게 있으며 상업적 이용이 가능합니다.</p>
            </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-10 rounded-3xl border border-white/10 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto" />
        <h3 className="text-3xl font-bold text-white">
            지금 바로 2026년 트렌드에 합류하세요
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            설치 없음. 회원가입 없음. 오직 브라우저 하나로 완성되는 4K 심리스 루프.
        </p>
      </div>

    </section>
  );
};