import React from 'react';
import { BookOpen, Cpu, TrendingUp, Layers, HelpCircle, CheckCircle2, Zap, BarChart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SeoContent = () => {
  const { language } = useLanguage();

  const ArticleCard = ({ icon, title, date, children }: { icon: React.ReactNode, title: string, date: string, children: React.ReactNode }) => (
    <article className="bg-[#1e1e1e] p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
        <header className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                {icon}
                <span>{date}</span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">{title}</h2>
        </header>
        <div className="prose prose-invert max-w-none text-gray-400 leading-7 text-sm">
            {children}
        </div>
    </article>
  );

  return (
    <section className="max-w-7xl mx-auto mt-20 px-4 space-y-20 border-t border-white/5 pt-16">
      
      {/* 2026 Trend Columns Section */}
      <div id="insights">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">2026 Media Insights</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
                심리스 루프 마스터가 분석한 최신 숏폼 트렌드와 기술 전략
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article 1: 2026 Trend */}
            <ArticleCard 
                icon={<TrendingUp className="w-4 h-4" />} 
                title="2026년 숏폼 콘텐츠 트렌드: 왜 무한 루프가 다시 주목받는가?" 
                date="2026 TREND REPORT"
            >
                <p>
                    2026년 디지털 마케팅의 화두는 단연 '도파민 루프(Dopamine Loop)'입니다. 사용자의 주의 집중 시간이 3초 미만으로 짧아진 현재, 콘텐츠의 시작과 끝을 모호하게 만드는 심리스 루프 기법은 선택이 아닌 필수가 되었습니다.
                </p>
                <p className="mt-4">
                    최근 틱톡과 인스타그램 릴스의 알고리즘 업데이트는 '재시청률(Re-watch Rate)'에 가장 높은 가중치를 부여합니다. 완벽하게 연결된 루프 영상은 시청자가 영상이 끝났음을 인지하지 못하게 하여 자연스럽게 2회, 3회 시청을 유도합니다. 이는 단순한 조회수 증가를 넘어, 플랫폼 알고리즘이 해당 콘텐츠를 '고품질'로 인식하게 만드는 가장 강력한 신호입니다.
                </p>
            </ArticleCard>

            {/* Article 2: Marketing Strategy */}
            <ArticleCard 
                icon={<BarChart className="w-4 h-4" />} 
                title="심리스 루프 영상을 활용한 브랜드 마케팅 성공 사례 분석" 
                date="MARKETING STRATEGY"
            >
                <p>
                    글로벌 패션 브랜드 A사는 2025년 F/W 캠페인에서 정적인 룩북 대신 'Type C (부메랑)' 모드를 활용한 루프 룩북을 선보였습니다. 모델의 턴 동작을 끊김 없이 반복시킨 이 5초짜리 영상은 일반 영상 대비 450% 높은 평균 시청 시간을 기록했습니다.
                </p>
                <p className="mt-4">
                    브랜드 마케팅에서 루프 영상은 '시각적 최면' 효과를 줍니다. 반복되는 브랜드 로고나 제품의 움직임은 소비자의 잠재의식 속에 브랜드를 깊이 각인시킵니다. 특히 ASMR이나 시네마그래프(Cinemagraph) 스타일의 미세한 움직임은 사용자의 피로도를 낮추면서도 지속적인 노출을 가능하게 하는 고효율 전략입니다.
                </p>
            </ArticleCard>

            {/* Article 3: Tech Analysis */}
            <ArticleCard 
                icon={<Cpu className="w-4 h-4" />} 
                title="AI 프레임 분석(Type B)과 마이크로 크로스페이드 기술의 원리" 
                date="TECH DEEP DIVE"
            >
                <p>
                    심리스 루프 마스터의 핵심 기술인 'Type B' 모드는 단순한 페이드 효과가 아닙니다. 이는 MSE(Mean Squared Error) 알고리즘을 브라우저 내에서 실시간으로 구동하여 수행됩니다.
                </p>
                <p className="mt-4">
                    WebAssembly(WASM) 기반의 FFmpeg 엔진은 영상의 첫 프레임과 가장 유사한 픽셀 패턴을 가진 마지막 프레임 구간을 0.01초 단위로 스캔합니다. 육안으로는 식별 불가능한 '수학적 최적 접점'을 찾아낸 후, 비선형(Non-linear) 마이크로 크로스페이드를 적용하여 글리치(Glitch) 없는 완벽한 결합을 만들어냅니다. 이 모든 과정이 서버 전송 없이 사용자의 GPU를 통해 로컬에서 안전하게 처리됩니다.
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