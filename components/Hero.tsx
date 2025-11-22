import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Hero = ({ onCtaClick }: { onCtaClick: () => void }) => {
    const { isNightMode } = useTheme();
    const navigate = useNavigate();
    return (
        <section className="relative pt-20 pb-24 px-6 overflow-hidden">
            <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 space-y-8 z-10 text-center lg:text-left">
                    <h1 className={`text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight animate-slide-up ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>
                        Estilo que brilha como uma <span className="text-yellow-400 inline-block transform hover:rotate-12 transition-transform cursor-default drop-shadow-md">Estrela</span>
                    </h1>
                    <p className={`text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up ${isNightMode ? 'text-gray-300' : 'text-indigo-900/70'}`} style={{ animationDelay: '0.1s' }}>
                        Descubra as marcas exclusivas <b>Kaine</b>, <b>Dingdang</b> e <b>Hagarradinhos</b>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button
                            onClick={() => navigate('/colecoes')}
                            className="btn-hover bg-hotpink-500 text-white text-lg px-10 py-4 rounded-full font-bold shadow-xl shadow-hotpink-500/30 border border-white/20"
                        >
                            Ver Coleção
                        </button>
                    </div>
                </div>
                <div className="lg:w-1/2 relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <img
                        src="https://images.unsplash.com/photo-1522771753035-5a5b753a5e67?q=80&w=1000&auto=format&fit=crop"
                        alt="Bebê feliz"
                        className={`relative z-10 w-full max-w-md mx-auto rounded-[3rem] shadow-2xl border-8 rotate-2 hover:rotate-0 transition-transform duration-700 ease-out object-cover aspect-[4/5] ${isNightMode ? 'border-indigo-800/50' : 'border-white/80'}`}
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
