import React from 'react';
import { BookOpen, Cpu, TrendingUp, Layers, HelpCircle, CheckCircle2, Zap, BarChart, FileVideo, Settings, Download, Lightbulb, UserCheck, Target, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SeoContent = () => {
  const { language, t } = useLanguage();

  const ArticleCard = ({ icon, title, date, children, className = "" }: { icon: React.ReactNode, title: string, date: string, children: React.ReactNode, className?: string }) => (
    <article className={`bg-[#1e1e1e] p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors h-full flex flex-col ${className}`}>
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
            <p className="text-gray-400">Step-by-Step Professional Guide by QPERATION</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#121212] p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:bg-[#181818] transition-colors">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">STEP 01</div>
                  <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                      <FileVideo className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.howto.step1}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.howto.step1Desc}</p>
              </div>

              <div className="bg-[#121212] p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:bg-[#181818] transition-colors">
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

              <div className="bg-[#121212] p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:bg-[#181818] transition-colors">
                  <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">STEP 03</div>
                  <div className="w-16 h-16 bg-green-900/20 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                      <Download className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t.howto.step3}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.howto.step3Desc}</p>
              </div>
          </div>
      </div>
      
      {/* 2026 Trend Columns Section - Massive Update for AdSense */}
      <div id="column" className="space-y-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                2026 Short-form Insight
            </h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
                QPERATION 크리에이티브 IP 그룹이 분석한 2026년 미디어 생태계와<br className="hidden md:block"/> 심리스 루프(Seamless Loop) 기술의 전략적 가치.
            </p>
          </div>

          {/* Main Feature Article */}
          <article className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Cover Image */}
              <div className="relative h-64 md:h-96 w-full overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Abstract Digital Tunnel representing Seamless Loops - Visual generated by Pexels" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 md:p-12">
                      <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>2026 Mega Trend Report</span>
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                          2026년 숏폼 미디어 생태계의 진화와<br/> 루프(Loop)의 귀환
                      </h1>
                      <p className="text-gray-300 max-w-2xl">
                          왜 유튜브 쇼츠와 인스타그램 릴스는 '끝나지 않는 영상'에 집착하는가?
                      </p>
                  </div>
              </div>

              {/* Article Content */}
              <div className="p-8 md:p-16 space-y-16">
                  
                  {/* Section 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                          <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-red-500 pl-4">YouTube Shorts</h3>
                          <p className="text-sm text-gray-500">알고리즘이 선택한 고정착 전략</p>
                      </div>
                      <div className="md:col-span-8 prose prose-invert prose-lg text-gray-300">
                          <p>
                              2026년 유튜브 알고리즘의 핵심 지표는 단순 조회수(View Count)에서 <strong>'평균 시청 지속 시간(Average View Duration)'</strong>과 <strong>'재시청률(Re-watch Rate)'</strong>로 완전히 이동했습니다. 특히 '100% 이상의 시청 지속 시간'은 해당 콘텐츠가 알고리즘의 추천(Suggesting)을 받기 위한 필수 조건이 되었습니다.
                          </p>
                          <p>
                              여기서 '심리스 루프(Seamless Loop)'는 강력한 무기가 됩니다. 영상의 시작과 끝이 명확히 구분되지 않는 루프 영상은 시청자가 영상의 종료 시점을 인지하지 못하게 하여, 무의식적으로 2회, 3회차 시청으로 유도합니다. 이는 시청 지속 시간을 인위적으로 늘리는 것이 아니라, 콘텐츠의 몰입감을 극대화하여 자연스럽게 달성하는 고도로 계산된 전략입니다. 실제로 루프 편집이 적용된 쇼츠는 일반 컷 편집 영상 대비 평균 140% 높은 시청 지속 시간을 기록하고 있습니다.
                          </p>
                      </div>
                  </div>

                  <hr className="border-white/5" />

                  {/* Section 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                          <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-pink-500 pl-4">Instagram Reels</h3>
                          <p className="text-sm text-gray-500">탐색 탭을 장악하는 심리스 트랜지션</p>
                      </div>
                      <div className="md:col-span-8 prose prose-invert prose-lg text-gray-300">
                           <div className="mb-6 rounded-xl overflow-hidden float-right ml-6 w-1/2 hidden md:block border border-white/10">
                                <img src="https://images.pexels.com/photos/7989680/pexels-photo-7989680.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Content Creation Setup - Pexels" className="w-full h-auto" />
                                <p className="text-xs text-gray-500 p-2 bg-[#0a0a0a] text-center">Visual by Pexels</p>
                           </div>
                          <p>
                              인스타그램 릴스는 '비주얼 만족감(Visual Satisfaction)'을 최우선으로 합니다. 2026년 릴스 트렌드는 화려한 이펙트보다는 <strong>'편안함(Cozy)'</strong>과 <strong>'연속성(Continuity)'</strong>에 초점을 맞추고 있습니다.
                          </p>
                          <p>
                              패션 룩북, 여행 브이로그, 심지어 요리 레시피 영상에서도 첫 프레임과 마지막 프레임을 교묘하게 일치시키는 '매치 컷(Match Cut)' 기법이 표준이 되었습니다. 심리스 루프 마스터의 'Type C (Boomerang)' 모드는 이러한 트렌드를 가장 손쉽게 구현할 수 있는 도구입니다. 자연스러운 역재생과 정재생의 결합은 시각적 피로도를 낮추면서도 무한히 반복되는 ASMR과 같은 효과를 주어, 사용자가 스크롤을 멈추고 멍하니 바라보게 만드는 '시각적 최면' 효과를 창출합니다.
                          </p>
                      </div>
                  </div>

                  <hr className="border-white/5" />

                  {/* Section 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                          <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-black pl-4">TikTok & Gen Alpha</h3>
                          <p className="text-sm text-gray-500">도파민을 자극하는 제로 프레임 갭</p>
                      </div>
                      <div className="md:col-span-8 prose prose-invert prose-lg text-gray-300">
                          <p>
                              잘파세대(Z+Alpha)의 콘텐츠 소비 패턴은 '나노 모먼트(Nano Moment)'로 정의됩니다. 이들은 0.5초의 지루함도 견디지 못합니다. 영상이 끝나고 다시 시작되는 그 찰나의 암전(Black Screen)이나 딜레이조차 이탈의 원인이 됩니다.
                          </p>
                          <p>
                              '제로 프레임 갭(Zero-frame Gap)' 기술은 이러한 이탈을 원천 차단합니다. 영상의 끝 프레임 데이터와 시작 프레임 데이터를 픽셀 단위로 분석하여(Type B Analysis), 프레임 간의 오차를 0으로 만드는 기술입니다. 이는 틱톡의 'For You' 피드에서 사용자가 다음 영상으로 스와이프할 타이밍을 뺏어버리는 강력한 락인(Lock-in) 효과를 발휘합니다.
                          </p>
                      </div>
                  </div>

                  {/* Strategic Guide Box */}
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-2xl border border-white/10 mt-12">
                      <div className="flex items-center gap-3 mb-6">
                          <Target className="w-8 h-8 text-blue-400" />
                          <h3 className="text-2xl font-bold text-white">QPERATION's Strategic Guide</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                               <h4 className="text-lg font-bold text-white flex items-center gap-2"><Eye className="w-4 h-4 text-purple-400"/> 촬영 단계 (Production)</h4>
                               <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                                   <li>삼각대 사용 필수: 배경이 고정되어야 완벽한 루프가 가능합니다.</li>
                                   <li>조명 통제: 자연광보다는 통제 가능한 조명을 사용하여 시간 경과에 따른 빛 변화를 막으세요.</li>
                                   <li>피사체 동선: 프레임 밖으로 나갔다가 다시 들어오는 동선은 가장 쉬운 루프 기법입니다.</li>
                               </ul>
                          </div>
                          <div className="space-y-4">
                               <h4 className="text-lg font-bold text-white flex items-center gap-2"><Cpu className="w-4 h-4 text-purple-400"/> 후반 작업 (Post-Production)</h4>
                               <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                                   <li>Type A (크로스페이드): 파도, 비, 연기 등 불규칙한 자연 현상에 적합합니다. (0.3s~0.5s 권장)</li>
                                   <li>Type B (AI 분석): 반복되는 기계적 움직임이나 걷는 동작에 최적화되어 있습니다.</li>
                                   <li>오디오 루프: 영상뿐만 아니라 오디오의 제로 크로싱(Zero Crossing) 지점도 맞춰야 합니다.</li>
                               </ul>
                          </div>
                      </div>
                  </div>

              </div>
          </article>
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
                <h4 className="font-bold text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-500"/> 운영사는 어디인가요?</h4>
                <p className="text-gray-400 text-sm">본 서비스는 QPERATION 크리에이티브 IP 그룹에 의해 운영 및 관리됩니다.</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-500"/> 상업적 이용이 가능한가요?</h4>
                <p className="text-gray-400 text-sm">본 도구로 제작된 결과물의 저작권은 100% 사용자에게 있으며 상업적 이용이 가능합니다.</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-500"/> 화질 저하는 없나요?</h4>
                <p className="text-gray-400 text-sm">최대 4K 해상도까지 원본 화질을 유지하며 렌더링됩니다.</p>
            </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-10 rounded-3xl border border-white/10 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto" />
        <h3 className="text-3xl font-bold text-white">
            QPERATION과 함께 2026년 트렌드를 선점하세요
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            설치 없음. 회원가입 없음. 오직 브라우저 하나로 완성되는 4K 심리스 루프.
        </p>
      </div>

    </section>
  );
};