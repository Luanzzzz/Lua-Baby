import React, { useState } from 'react';
import { Product } from '../types';
import { ArrowRight, RefreshCcw, ShoppingBag, Shuffle, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface MixMatchProps {
  products: Product[];
}

const MixMatchStudio: React.FC<MixMatchProps> = ({ products }) => {
  const tops = products.filter(p => p.category === 'top' || p.category === 'fullbody');
  const bottoms = products.filter(p => p.category === 'bottom');
  const { addToCart } = useCart();

  const [selectedTop, setSelectedTop] = useState<Product>(tops[0]);
  const [selectedBottom, setSelectedBottom] = useState<Product | null>(bottoms[0] || null);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleAddLook = () => {
    if (selectedTop) {
      addToCart(selectedTop, selectedTop.sizes[0] || 'Único', selectedTop.colors?.[0] || 'Padrão');
    }
    if (selectedBottom) {
      addToCart(selectedBottom, selectedBottom.sizes[0] || 'Único', selectedBottom.colors?.[0] || 'Padrão');
    }
  };

  const handleShuffle = () => {
    setIsShuffling(true);

    // Simulate shuffling animation
    let shuffles = 0;
    const maxShuffles = 6;
    const interval = setInterval(() => {
      const randomTop = tops[Math.floor(Math.random() * tops.length)];
      const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];

      setSelectedTop(randomTop);
      setSelectedBottom(randomBottom);

      shuffles++;
      if (shuffles >= maxShuffles) {
        clearInterval(interval);
        setIsShuffling(false);
      }
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-display font-bold text-gray-800 mb-2">Estúdio de Looks</h2>
        <p className="text-gray-600 text-lg">Misture, combine e descubra o estilo perfeito!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch h-full min-h-[600px]">

        {/* Left Sidebar: Tops */}
        <div className="lg:w-1/4 glass-premium rounded-3xl p-4 shadow-sm overflow-y-auto max-h-[600px] scrollbar-thin">
          <h3 className="font-bold text-sky-500 mb-4 flex items-center gap-2 sticky top-0 bg-white/80 backdrop-blur py-2 z-10">
            <span className="bg-sky-100 p-2 rounded-lg">👕</span> Parte de Cima
          </h3>
          <div className="space-y-4">
            {tops.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedTop(product)}
                className={`cursor-pointer p-3 rounded-2xl border-2 transition-all duration-300 group ${selectedTop?.id === product.id ? 'border-sky-400 bg-sky-50 shadow-md' : 'border-transparent hover:bg-white hover:shadow-sm'}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedTop(product); }}
              >
                <div className="flex gap-3 items-center">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl" />
                  <div>
                    <p className="text-sm font-bold text-gray-700 group-hover:text-sky-500 transition-colors line-clamp-1">{product.name}</p>
                    <p className="text-xs font-bold text-hotpink-500 mt-1">R$ {product.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="lg:w-2/4 flex flex-col">
          <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-sky-50/50 rounded-[2rem] border-4 border-white shadow-xl flex flex-col items-center justify-center p-8 relative overflow-hidden">

            {/* Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
              <div className="glass px-4 py-2 rounded-full text-hotpink-500 font-bold shadow-lg flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Total: R$ {((selectedTop?.price || 0) + (selectedBottom?.price || 0)).toFixed(2)}
              </div>
              <button
                onClick={handleShuffle}
                disabled={isShuffling}
                className="bg-white p-3 rounded-full text-sky-500 shadow-lg hover:rotate-180 transition-all duration-500 hover:bg-sky-50"
                title="Embaralhar Looks"
              >
                <Shuffle className={`w-6 h-6 ${isShuffling ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Top Display */}
            <div className={`relative z-10 transition-all duration-500 ${isShuffling ? 'scale-90 blur-sm' : 'hover:scale-105'}`}>
              {selectedTop && (
                <img
                  src={selectedTop.image}
                  alt="Top"
                  className="w-64 h-64 object-contain drop-shadow-2xl"
                />
              )}
            </div>

            {/* Bottom Display */}
            <div className={`relative z-0 -mt-12 transition-all duration-500 ${isShuffling ? 'scale-90 blur-sm' : 'hover:scale-105'}`}>
              {selectedBottom ? (
                <img
                  src={selectedBottom.image}
                  alt="Bottom"
                  className="w-60 h-60 object-contain drop-shadow-xl"
                />
              ) : (
                <div className="w-60 h-60 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-2xl bg-white/50">
                  Selecione uma parte de baixo
                </div>
              )}
            </div>

          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleAddLook}
              className="btn-hover bg-gradient-to-r from-sky-400 via-sky-500 to-hotpink-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-sky-200 flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              Adicionar Look Completo
            </button>
          </div>
        </div>

        {/* Right Sidebar: Bottoms */}
        <div className="lg:w-1/4 glass-premium rounded-3xl p-4 shadow-sm overflow-y-auto max-h-[600px] scrollbar-thin">
          <h3 className="font-bold text-moon-500 mb-4 flex items-center gap-2 sticky top-0 bg-white/80 backdrop-blur py-2 z-10">
            <span className="bg-moon-100 p-2 rounded-lg">👖</span> Parte de Baixo
          </h3>
          <div className="space-y-4">
            {bottoms.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedBottom(product)}
                className={`cursor-pointer p-3 rounded-2xl border-2 transition-all duration-300 group ${selectedBottom?.id === product.id ? 'border-moon-400 bg-moon-50 shadow-md' : 'border-transparent hover:bg-white hover:shadow-sm'}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedBottom(product); }}
              >
                <div className="flex gap-3 items-center">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl" />
                  <div>
                    <p className="text-sm font-bold text-gray-700 group-hover:text-moon-500 transition-colors line-clamp-1">{product.name}</p>
                    <p className="text-xs font-bold text-hotpink-500 mt-1">R$ {product.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixMatchStudio;