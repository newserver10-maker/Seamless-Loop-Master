import React, { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { LoopEditor } from './components/LoopEditor';
import { Infinity } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-blue-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 h-full">
        {!file ? (
          <div className="flex flex-col h-full max-w-4xl mx-auto">
             <header className="flex items-center justify-center gap-3 mb-12 mt-10">
                <Infinity className="w-10 h-10 text-blue-500" />
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  심리스 루프 마스터
                </h1>
             </header>
             <VideoUploader onFileSelect={setFile} />
             <footer className="mt-12 text-center text-gray-500 text-sm">
                <p>브라우저에서 직접 실행되는 안전한 편집 도구입니다. 서버로 영상이 전송되지 않습니다.</p>
             </footer>
          </div>
        ) : (
          <LoopEditor file={file} onBack={() => setFile(null)} />
        )}
      </main>
    </div>
  );
}