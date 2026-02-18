import React from 'react';
import { BookOpen, Cpu, TrendingUp, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SeoContent = () => {
  const { language } = useLanguage();

  if (language !== 'ko') {
    return (
        <section className="max-w-4xl mx-auto mt-16 px-6 text-gray-300 space-y-12">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-blue-500" />
                    Why Seamless Loops Matter in Social Media Marketing
                </h2>
                <p className="leading-relaxed text-gray-400">
                    In the era of TikTok, Instagram Reels, and YouTube Shorts, user retention is the most critical metric. 
                    A "Seamless Loop" video—one that repeats without a visible cut—tricks the brain into watching the content multiple times. 
                    This artificially inflates the "Watch Time" and "Retention Rate," signaling to algorithms that your content is highly engaging.
                </p>
            </div>
            {/* ... abbreviated English content for brevity, focusing on Korean requirement ... */}
        </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto mt-20 px-6 text-gray-300 space-y-16 border-t border-white/5 pt-16">
      
      {/* Section 1 */}
      <article className="space-y-6">
        <header>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                SNS 마케팅에서 '심리스 루프(Seamless Loop)'가 필수적인 이유
            </h2>
            <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
        </header>
        <div className="prose prose-invert max-w-none text-gray-300 leading-8">
            <p>
                숏폼 콘텐츠의 전성시대입니다. 틱톡(TikTok), 인스타그램 릴스(Reels), 유튜브 쇼츠(Shorts) 등 모든 플랫폼의 알고리즘은 단 하나의 지표를 가장 중요하게 생각합니다. 바로 <strong>'시청 지속 시간(Retention)'</strong>과 <strong>'반복 재생 횟수'</strong>입니다.
            </p>
            <p>
                일반적인 영상은 끝나는 시점이 명확하여 사용자가 다음 영상으로 스크롤을 넘기게 만듭니다. 하지만 시작과 끝이 완벽하게 연결된 <strong>심리스 루프 영상</strong>은 사용자가 영상이 끝났다는 사실을 인지하지 못한 채 2번, 3번 반복해서 시청하게 만듭니다. 이러한 '무의식적 반복 시청'은 알고리즘 점수를 폭발적으로 높여 탐색 탭 노출 확률을 극대화합니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 bg-black/20 p-6 rounded-xl border border-white/5">
                <li><strong>이탈률 감소:</strong> 끊김 없는 연결은 시청자의 몰입을 방해하지 않습니다.</li>
                <li><strong>시청 시간 증대:</strong> 15초 영상을 3번 보면 45초 시청으로 기록되어 고품질 콘텐츠로 분류됩니다.</li>
                <li><strong>브랜딩 효과:</strong> 세련된 편집 기술은 브랜드의 전문성을 간접적으로 보여줍니다.</li>
            </ul>
        </div>
      </article>

      {/* Section 2 */}
      <article className="space-y-6">
        <header>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
                <Cpu className="w-8 h-8 text-purple-500" />
                AI 기반 초정밀 분석(Type B)은 어떻게 작동하나요?
            </h2>
            <div className="h-1 w-20 bg-purple-500 rounded-full"></div>
        </header>
        <div className="prose prose-invert max-w-none text-gray-300 leading-8">
            <p>
                사람의 눈으로 0.1초 단위의 프레임을 완벽하게 맞추는 것은 매우 어렵습니다. 심리스 루프 마스터의 <strong>Type B (초정밀 분석)</strong> 모드는 단순한 페이드 효과를 넘어, 영상 데이터 자체를 분석합니다.
            </p>
            <p>
                이 기술은 <strong>MSE(Mean Squared Error)</strong> 알고리즘을 활용하여 영상의 시작 부분 프레임과 가장 유사한 시각적 특징을 가진 종료 부분 프레임을 픽셀 단위로 스캔합니다. 수천 개의 프레임을 비교 분석하여 '육안으로 차이를 느낄 수 없는' 최적의 결합 지점을 자동으로 찾아냅니다.
            </p>
            <p>
                특히 파도 소리, 빗소리 같은 백색 소음(ASMR) 영상이나, 구름의 움직임, 흐르는 물 같은 자연 영상에서 이 모드를 사용하면 전문가 수준의 자연스러운 무한 반복 영상을 단 몇 초 만에 완성할 수 있습니다.
            </p>
        </div>
      </article>

      {/* Section 3 */}
      <article className="space-y-6">
        <header>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
                <Layers className="w-8 h-8 text-green-500" />
                3가지 루프 모드 완벽 가이드 및 활용 팁
            </h2>
            <div className="h-1 w-20 bg-green-500 rounded-full"></div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/5 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-3">Type A: 강제 크로스페이드</h3>
                <p className="text-sm text-gray-400 mb-4">가장 기본적인 방식</p>
                <p className="text-sm leading-6">
                    영상 끝부분과 시작부분을 겹쳐서 투명도(Opacity)를 조절합니다. 어떤 영상이든 강제로 이어 붙일 수 있지만, 피사체의 움직임이 크다면 잔상이 남을 수 있습니다. 풍경이나 배경 영상에 적합합니다.
                </p>
            </div>
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-purple-500/20 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1">추천</div>
                <h3 className="text-xl font-bold text-white mb-3">Type B: AI 자동 최적화</h3>
                <p className="text-sm text-gray-400 mb-4">알고리즘 기반 매칭</p>
                <p className="text-sm leading-6">
                    프레임 간의 유사도를 계산하여 '튀는' 느낌이 전혀 없는 지점을 찾아냅니다. 편집자의 감에 의존하지 않고 데이터에 기반하여 가장 자연스러운 결과물을 만듭니다.
                </p>
            </div>
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/5 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-3">Type C: 부메랑 (Boomerang)</h3>
                <p className="text-sm text-gray-400 mb-4">인스타그램 스타일</p>
                <p className="text-sm leading-6">
                    영상을 정방향으로 재생했다가 다시 역방향으로 재생합니다. 춤 영상, 걷는 영상 등 리듬감이 필요한 콘텐츠에서 가장 많이 사용됩니다. 끊김이 원천적으로 발생할 수 없는 구조입니다.
                </p>
            </div>
        </div>
      </article>

      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border border-white/10 text-center space-y-4">
        <BookOpen className="w-10 h-10 text-white mx-auto" />
        <h3 className="text-2xl font-bold text-white">지금 바로 시작해보세요</h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
            복잡한 프리미어 프로나 애프터 이펙트 없이도, 브라우저에서 즉시 4K 화질의 심리스 루프 영상을 만들 수 있습니다. 
            서버에 업로드되지 않아 보안 걱정 없이 안전합니다.
        </p>
      </div>

    </section>
  );
};