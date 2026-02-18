import React from 'react';
import { BookOpen, Cpu, TrendingUp, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SeoContent = () => {
  const { language } = useLanguage();

  const FAQItem = ({ q, a }: { q: string, a: string }) => (
    <div className="bg-[#1e1e1e] p-6 rounded-xl border border-white/5">
        <h4 className="flex items-start text-lg font-semibold text-white mb-2">
            <HelpCircle className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
            {q}
        </h4>
        <p className="text-gray-400 leading-relaxed pl-7">{a}</p>
    </div>
  );

  return (
    <section className="max-w-4xl mx-auto mt-20 px-6 text-gray-300 space-y-20 border-t border-white/5 pt-16">
      
      {/* Comprehensive Strategic Guide */}
      <article className="space-y-8">
        <header className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {language === 'ko' 
                    ? "심리스 루프 영상을 활용하여 SNS 조회수를 높이는 전략적 가이드" 
                    : "Strategic Guide to Increasing SNS Views Using Seamless Loops"}
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
                {language === 'ko'
                    ? "인스타그램 릴스, 틱톡 알고리즘의 핵심은 '시청 지속 시간'입니다. 완벽한 루프 영상으로 사용자의 이탈을 막으세요."
                    : "Retention is king on Instagram Reels and TikTok. Use perfect loops to stop users from scrolling away."}
            </p>
        </header>

        <div className="prose prose-invert max-w-none text-gray-300 leading-8 space-y-8">
            <section>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
                    <TrendingUp className="text-blue-500" />
                    {language === 'ko' ? "1. 왜 '무한 반복'이 중요한가?" : "1. Why 'Infinite Loop' Matters?"}
                </h2>
                <p>
                    {language === 'ko'
                        ? "숏폼 콘텐츠 플랫폼의 추천 알고리즘은 사용자가 영상을 끝까지 보았는지(Completion Rate), 그리고 다시 보았는지(Re-watch Rate)를 가장 중요한 평가 지표로 삼습니다. 심리스 루프(Seamless Loop) 영상은 시작과 끝이 인지할 수 없을 정도로 매끄럽게 연결되어 있어, 시청자가 영상이 끝났다는 사실을 깨닫지 못한 채 무의식적으로 2회, 3회차 시청을 하게 만듭니다. 이는 체류 시간을 200~300% 이상 증대시키는 가장 효과적인 해킹 전략입니다."
                        : "Algorithms prioritize Completion Rate and Re-watch Rate. Seamless loops trick the viewer into watching the content multiple times without realizing it ended, boosting retention by 200-300%."}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
                    <Cpu className="text-purple-500" />
                    {language === 'ko' ? "2. 기술적 완성도가 조회수를 결정합니다" : "2. Technical Perfection Drives Views"}
                </h2>
                <p>
                    {language === 'ko'
                        ? "단순히 영상을 잘라 붙이는 것만으로는 부족합니다. 미세한 밝기 변화, 피사체의 위치 차이, 배경 소음의 단절 등은 시청자의 몰입을 깨뜨립니다. 본 서비스의 'Type B (AI 정밀 분석)' 모드는 MSE(Mean Squared Error) 알고리즘을 통해 수천 개의 프레임을 픽셀 단위로 비교 분석합니다. 인간의 눈으로는 찾기 힘든 '수학적으로 가장 완벽한 연결 지점'을 찾아내어 전문 편집자가 작업한 듯한 퀄리티를 보장합니다."
                        : "Simple cuts aren't enough. Minor glitches break immersion. Our Type B AI mode analyzes frames pixel-by-pixel to find the mathematically perfect loop point that human eyes often miss."}
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
                    <Layers className="text-green-500" />
                    {language === 'ko' ? "3. 콘텐츠 유형별 루프 전략" : "3. Loop Strategies by Content Type"}
                </h2>
                <ul className="space-y-4">
                    <li className="bg-black/20 p-4 rounded-lg">
                        <strong className="text-white block mb-1">풍경/ASMR (Type A/B):</strong> 
                        {language === 'ko' ? "파도, 비, 구름 등은 크로스페이드(Crossfade) 기법이 가장 자연스럽습니다." : "For nature scenes, use Crossfade."}
                    </li>
                    <li className="bg-black/20 p-4 rounded-lg">
                        <strong className="text-white block mb-1">댄스/액션 (Type C):</strong> 
                        {language === 'ko' ? "반복되는 동작은 부메랑(Boomerang) 모드를 사용하여 리듬감을 극대화하세요." : "For rhythmic action, use Boomerang mode."}
                    </li>
                    <li className="bg-black/20 p-4 rounded-lg">
                        <strong className="text-white block mb-1">시네마그래프:</strong> 
                        {language === 'ko' ? "영상의 특정 부분만 움직이고 나머지는 고정된 형태라면 고정밀 분석이 필수입니다." : "For cinemagraphs, high-precision analysis is essential."}
                    </li>
                </ul>
            </section>
        </div>
      </article>

      {/* FAQ Section for SEO & User Trust */}
      <section id="faq" className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
            {language === 'ko' ? "자주 묻는 질문 (FAQ)" : "Frequently Asked Questions"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FAQItem 
                q={language === 'ko' ? "이 서비스는 정말 무료인가요?" : "Is this service really free?"}
                a={language === 'ko' ? "네, 100% 무료이며 워터마크가 삽입되지 않습니다." : "Yes, it is 100% free and no watermarks are added."}
            />
            <FAQItem 
                q={language === 'ko' ? "제 영상이 서버에 저장되나요?" : "Is my video uploaded to a server?"}
                a={language === 'ko' ? "아니요, 본 서비스는 '서버리스' 기술을 사용합니다. 모든 편집 과정은 사용자의 브라우저 내에서 이루어지며 외부로 유출되지 않습니다." : "No, we use serverless technology. All processing happens locally in your browser."}
            />
            <FAQItem 
                q={language === 'ko' ? "지원하는 파일 형식은 무엇인가요?" : "What file formats are supported?"}
                a={language === 'ko' ? "MP4, MOV, WebM 등 대부분의 최신 비디오 형식을 지원합니다." : "We support MP4, MOV, WebM and most modern video formats."}
            />
            <FAQItem 
                q={language === 'ko' ? "화질 저하가 발생하나요?" : "Is there quality loss?"}
                a={language === 'ko' ? "최신 ffmpeg.wasm 기술을 사용하여 원본 해상도(최대 4K)를 유지한 채 렌더링합니다." : "We use ffmpeg.wasm to maintain original resolution (up to 4K)."}
            />
            <FAQItem 
                q={language === 'ko' ? "모바일에서도 사용 가능한가요?" : "Can I use it on mobile?"}
                a={language === 'ko' ? "네, 아이폰과 안드로이드 브라우저 모두에서 완벽하게 작동합니다." : "Yes, it works perfectly on both iPhone and Android browsers."}
            />
            <FAQItem 
                q={language === 'ko' ? "Type B 분석이 실패하면 어떻게 하나요?" : "What if Type B analysis fails?"}
                a={language === 'ko' ? "영상 변화가 너무 심한 경우 분석이 어려울 수 있습니다. 이 경우 Type A(강제 오버랩)를 사용하고 페이드 시간을 조절해보세요." : "If the video changes too much, try using Type A with adjusted fade duration."}
            />
        </div>
      </section>

      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border border-white/10 text-center space-y-4">
        <CheckCircle2 className="w-10 h-10 text-blue-400 mx-auto" />
        <h3 className="text-2xl font-bold text-white">
            {language === 'ko' ? "지금 바로 시작해보세요" : "Start Creating Now"}
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
            {language === 'ko' 
                ? "별도의 프로그램 설치 없이, 전문가 수준의 루프 영상을 단 몇 초 만에 완성할 수 있습니다." 
                : "Create professional loop videos in seconds without installing any software."}
        </p>
      </div>

    </section>
  );
};