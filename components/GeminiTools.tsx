import React, { useState, useRef } from 'react';
import { editImageWithGemini, generateVeoVideo } from '../services/geminiService';
import { Camera, Sparkles, Video, Loader2, Wand2, Download, Image as ImageIcon, Zap } from 'lucide-react';

const GeminiTools: React.FC = () => {
  const [mode, setMode] = useState<'edit' | 'video'>('edit');
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingMessages = [
    "Consultando as estrelas... ✨",
    "Misturando cores mágicas... 🎨",
    "Ajustando os pixels lunares... 🌙",
    "Quase lá, criando algo incrível... 🚀",
    "O robô está pintando sua ideia... 🤖"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const cycleLoadingMessages = () => {
    let i = 0;
    setLoadingMessage(loadingMessages[0]);
    return setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[i]);
    }, 2000);
  };

  const handleGenerate = async () => {
    if (!image || !prompt) return;
    if (!process.env.API_KEY) {
      alert("API Key não encontrada. Configure sua chave Gemini para usar este recurso.");
      return;
    }

    setIsLoading(true);
    const intervalId = cycleLoadingMessages();

    try {
      if (mode === 'edit') {
        const editedImage = await editImageWithGemini(image, prompt);
        setResult(editedImage);
      } else {
        const videoUrl = await generateVeoVideo(image, prompt);
        setResult(videoUrl);
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao processar sua solicitação com a IA.");
    } finally {
      clearInterval(intervalId);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-slide-up">
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
        </div>
        <h2 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
          Estúdio Mágico IA
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Transforme fotos do seu bebê em aventuras espaciais ou crie vídeos divertidos com o poder do <b>Google Gemini</b>.
        </p>
      </div>

      <div className="glass-premium rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/60 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full filter blur-[100px] opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full filter blur-[100px] opacity-20 -z-10"></div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          <button
            onClick={() => { setMode('edit'); setResult(null); }}
            className={`group px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 ${mode === 'edit' ? 'bg-purple-500 text-white shadow-xl shadow-purple-200 scale-105' : 'bg-white text-gray-500 hover:bg-purple-50 border border-gray-100'}`}
          >
            <Wand2 className={`w-5 h-5 ${mode === 'edit' ? 'animate-bounce' : ''}`} />
            Editor de Fotos
          </button>
          <button
            onClick={() => { setMode('video'); setResult(null); }}
            className={`group px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 ${mode === 'video' ? 'bg-pink-500 text-white shadow-xl shadow-pink-200 scale-105' : 'bg-white text-gray-500 hover:bg-pink-50 border border-gray-100'}`}
          >
            <Video className={`w-5 h-5 ${mode === 'video' ? 'animate-bounce' : ''}`} />
            Criar Vídeo (Veo)
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group border-3 border-dashed border-purple-200 rounded-3xl h-72 flex flex-col items-center justify-center bg-purple-50/30 cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition-all relative overflow-hidden"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
            >
              {image ? (
                <img src={image} alt="Upload" className="w-full h-full object-contain p-2 rounded-3xl" />
              ) : (
                <div className="text-center text-purple-400 p-6 transition-transform group-hover:scale-105">
                  <div className="bg-white p-4 rounded-full inline-block shadow-md mb-4">
                    <Camera className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="font-bold text-lg text-gray-700">Clique para enviar uma foto</p>
                  <p className="text-sm opacity-70 mt-1">Suporta JPG e PNG</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="prompt-input" className="text-gray-700 font-bold ml-1 flex items-center gap-2">
                {mode === 'edit' ? <ImageIcon className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                {mode === 'edit' ? 'O que você quer mudar?' : 'Como o vídeo deve ser?'}
              </label>
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'edit' ? "Ex: Adicione asas de fada, coloque o bebê na lua..." : "Ex: Faça o bebê sorrir e acenar, adicione brilhos caindo..."}
                className="w-full rounded-2xl border-2 border-gray-100 p-5 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all h-32 resize-none text-lg bg-white/80 backdrop-blur"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !image || !prompt}
              className="btn-hover w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  {mode === 'edit' ? 'Transformar Foto' : 'Gerar Vídeo'}
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-gray-900 rounded-3xl flex items-center justify-center relative overflow-hidden min-h-[400px] shadow-inner border-4 border-white/20">
            {!result && !isLoading && (
              <div className="text-center text-gray-500 px-6">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">A mágica aparecerá aqui</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center space-y-6 relative z-10 px-4">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 border-t-4 border-pink-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-t-4 border-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                </div>
                <p className="text-white font-display font-bold text-xl animate-pulse bg-black/30 px-6 py-2 rounded-full backdrop-blur-md border border-white/10">
                  {loadingMessage}
                </p>
              </div>
            )}

            {result && mode === 'edit' && (
              <img src={result} alt="Resultado IA" className="w-full h-full object-contain animate-fade-in" />
            )}

            {result && mode === 'video' && (
              <video
                src={result}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain animate-fade-in"
              />
            )}

            {result && (
              <div className="absolute bottom-6 left-6 right-6 flex justify-center">
                <a
                  href={result}
                  download={mode === 'video' ? 'video-magico.mp4' : 'foto-magica.png'}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all border border-white/40 shadow-lg hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Baixar Resultado
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiTools;