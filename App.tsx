
import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  Plus, 
  Search, 
  Settings, 
  BarChart3,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  User,
  AlertTriangle,
  Package,
  Star,
  Menu,
  LogOut,
  CheckCircle2,
  Truck,
  Clock,
  Moon,
  ArrowRight,
  Gift,
  Flame,
  Filter,
  ChevronDown,
  ChevronUp,
  ListFilter,
  Heart,
  Eye,
  Edit2,
  Save,
  Image as ImageIcon,
  Monitor,
  Upload,
  LayoutDashboard,
  FileJson,
  CheckSquare,
  Square,
  LayoutGrid
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

import Navbar from './components/Navbar';
import StarHunt from './components/StarHunt';
import MixMatchStudio from './components/MixMatchStudio';
import GeminiTools from './components/GeminiTools';
import { Product, CartItem, ViewState, Order } from './types';
import { getProducts, addProduct, deleteProduct } from './services/firebaseService';

// --- Theme Context ---
const ThemeContext = React.createContext({ isNightMode: false });

// --- Global Toast Notification ---
const ToastContext = React.createContext<{ addToast: (msg: string, type?: 'success' | 'info') => void }>({ addToast: () => {} });

const ToastContainer: React.FC<{ toasts: { id: number; msg: string; type: 'success' | 'info' }[]; removeToast: (id: number) => void }> = ({ toasts, removeToast }) => (
  <div className="fixed top-24 right-6 z-[200] space-y-3">
    {toasts.map(toast => (
      <div 
        key={toast.id} 
        onClick={() => removeToast(toast.id)}
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl transform transition-all animate-slide-up cursor-pointer hover:scale-102 ${
          toast.type === 'success' ? 'bg-white border-l-4 border-green-500 text-gray-800' : 'bg-white border-l-4 border-sky-500 text-gray-800'
        }`}
      >
        {toast.type === 'success' ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <Sparkles className="text-sky-500 w-6 h-6" />}
        <span className="font-bold">{toast.msg}</span>
      </div>
    ))}
  </div>
);

// --- Night Sky Component (Magical Background for Dark Mode) ---
const NightSky: React.FC = () => {
    const [stars, setStars] = useState<{id: number, top: number, left: number, size: number, delay: number}[]>([]);
    const [shootingStar, setShootingStar] = useState<{key: number, top: number, left: number} | null>(null);
    
    useEffect(() => {
        // Generate twinkling stars
        const starCount = 50;
        const newStars = [];
        for (let i = 0; i < starCount; i++) {
            newStars.push({
                id: i,
                top: Math.random() * 100,
                left: Math.random() * 100,
                size: Math.random() * 3 + 1,
                delay: Math.random() * 3
            });
        }
        setStars(newStars);

        // Random shooting stars
        const interval = setInterval(() => {
            if (Math.random() > 0.6) {
                setShootingStar({
                    key: Date.now(),
                    top: Math.random() * 50,
                    left: Math.random() * 80 + 20
                });
            }
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Twinkling Stars */}
            {stars.map(star => (
                <div 
                    key={star.id}
                    className="star animate-twinkle"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        opacity: Math.random()
                    }}
                />
            ))}

            {/* Shooting Star */}
            {shootingStar && (
                <div 
                    key={shootingStar.key}
                    className="shooting-star-trail animate-shooting-star"
                    style={{
                        top: `${shootingStar.top}%`,
                        left: `${shootingStar.left}%`
                    }}
                />
            )}

            {/* The Mascot: Crescent Moon with Pacifier */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 w-[600px] h-[600px] transition-opacity duration-1000">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Moon Body */}
                    <path d="M160 100C160 144.183 124.183 180 80 180C65.185 180 51.28 175.97 39.24 168.88C58.28 162.13 72 144.06 72 122.5C72 95.16 49.84 73 22.5 73C14.86 73 7.6 74.62 1.05 77.52C10.6 44.8 41.2 20 80 20C124.183 20 160 55.817 160 100Z" fill="#FDE047"/>
                    {/* Pacifier Ring */}
                    <circle cx="150" cy="130" r="15" stroke="#F472B6" strokeWidth="4"/>
                    {/* Sleep Zzz */}
                    <text x="160" y="60" fill="white" fontSize="20" fontFamily="Quicksand" fontWeight="bold">Zzz</text>
                    <text x="180" y="40" fill="white" fontSize="15" fontFamily="Quicksand" fontWeight="bold">z</text>
                </svg>
            </div>
        </div>
    );
};

// --- Twilight Ambience Component (Magical Background for Light Mode) ---
const TwilightAmbience: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* The Setting Sun (Bottom-Left) */}
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-orange-300 rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-pulse-slow"></div>
        
        {/* The Waking Moon (Top-Right) */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-indigo-300 rounded-full blur-[120px] opacity-30 mix-blend-multiply flex items-center justify-center animate-pulse">
           {/* Icon of Moon inside the orb for clarity */}
           <div className="absolute top-40 right-40 opacity-20 transform rotate-12">
              <Moon className="w-64 h-64 text-indigo-500 fill-indigo-200" />
           </div>
        </div>

        {/* Subtle cloud wisps */}
        <div className="absolute top-1/4 left-1/3 w-96 h-32 bg-white rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-24 bg-rose-200 rounded-full blur-3xl opacity-30"></div>
    </div>
  );
};

// --- Components within App.tsx ---

const FloatingStarBadge: React.FC<{ count: number }> = ({ count }) => {
  const { isNightMode } = useContext(ThemeContext);
  if (count >= 3) return null; 
  return (
    <div className="fixed bottom-6 left-6 z-50 animate-float">
        <div className={`px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border group cursor-pointer hover:scale-105 transition-transform ${isNightMode ? 'glass-dark border-indigo-700' : 'glass-premium border-white/80'}`}>
            <div className="relative">
                <Star className="w-8 h-8 text-moon-400 fill-moon-400 drop-shadow-sm" />
                <div className="absolute inset-0 animate-ping opacity-20 bg-moon-300 rounded-full"></div>
            </div>
            <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isNightMode ? 'text-gray-400' : 'text-indigo-900/60'}`}>Star Hunt</p>
                <p className={`text-lg font-display font-bold leading-none ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>{count}/3 Encontradas</p>
            </div>
        </div>
    </div>
  );
};

const Hero = ({ onCtaClick }: { onCtaClick: () => void }) => {
  const { isNightMode } = useContext(ThemeContext);
  return (
    <section className="relative pt-20 pb-24 px-6 overflow-hidden">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 space-y-8 z-10 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start gap-3 mb-2 flex-wrap">
            <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm shadow-sm border animate-fade-in ${isNightMode ? 'bg-white/10 border-white/20 text-sky-300' : 'bg-white/60 border-white/50 text-indigo-600'}`} style={{animationDelay: '0.1s'}}>
              🚀 Nova Coleção 2025
            </div>
            <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm shadow-sm border animate-fade-in ${isNightMode ? 'bg-moon-900/50 border-moon-800 text-moon-300' : 'bg-indigo-50/60 border-indigo-100 text-indigo-600'}`} style={{animationDelay: '0.2s'}}>
              ✨ 10% OFF na Primeira Compra
            </div>
          </div>
          {/* Typography Updated for Golden Hour: Indigo-950 provides rich contrast against orange/rose bg */}
          <h1 className={`text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight animate-slide-up ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>
            Estilo que brilha como uma <span className="text-yellow-400 inline-block transform hover:rotate-12 transition-transform cursor-default drop-shadow-md">Estrela</span>
          </h1>
          <p className={`text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up ${isNightMode ? 'text-gray-300' : 'text-indigo-900/70'}`} style={{animationDelay: '0.1s'}}>
            Descubra as marcas exclusivas <b>Kaine</b>, <b>Dingdang</b> e <b>Hagarradinhos</b>. Moda divertida, confortável e cheia de personalidade para seu pequeno.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{animationDelay: '0.2s'}}>
              <button 
              onClick={onCtaClick}
              className="btn-hover bg-hotpink-500 text-white text-lg px-10 py-4 rounded-full font-bold shadow-xl shadow-hotpink-500/30 border border-white/20"
              >
              Ver Coleção
              </button>
              <button className={`btn-hover text-lg px-10 py-4 rounded-full font-bold shadow-lg border transition-colors ${isNightMode ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : 'bg-white/60 text-indigo-900 border-white/50 hover:bg-white/80'}`}>
              Conhecer Marcas
              </button>
          </div>
        </div>
        <div className="lg:w-1/2 relative animate-fade-in" style={{animationDelay: '0.3s'}}>
          <div className="absolute top-10 right-10 w-80 h-80 bg-sky-300 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-moon-300 rounded-full blur-[100px] opacity-40 animate-pulse delay-1000"></div>
          <img 
            src="https://images.unsplash.com/photo-1522771753035-5a5b753a5e67?q=80&w=1000&auto=format&fit=crop" 
            alt="Bebê feliz" 
            className={`relative z-10 w-full max-w-md mx-auto rounded-[3rem] shadow-2xl border-8 rotate-2 hover:rotate-0 transition-transform duration-700 ease-out object-cover aspect-[4/5] ${isNightMode ? 'border-indigo-800/50' : 'border-white/80'}`}
          />
          
          {/* Floating Elements */}
          <div className={`absolute top-10 right-10 p-4 rounded-2xl shadow-xl animate-float z-20 hidden md:block ${isNightMode ? 'glass-dark' : 'glass'}`}>
            <span className="text-3xl">🧸</span>
          </div>
          <div className={`absolute bottom-20 left-0 p-4 rounded-2xl shadow-xl animate-float z-20 hidden md:block ${isNightMode ? 'glass-dark' : 'glass'}`} style={{ animationDelay: '2s' }}>
            <span className="text-3xl">⭐</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// New Component: Brand Explorer
const BrandExplorer: React.FC<{ onSelectBrand: (brand: string) => void }> = ({ onSelectBrand }) => {
  const { isNightMode } = useContext(ThemeContext);
  
  const brands = [
    { name: 'Kaine', color: 'bg-gray-900', text: 'text-white', icon: '🛹', desc: 'Urbano & Radical' },
    { name: 'Dingdang', color: 'bg-hotpink-500', text: 'text-white', icon: '🎨', desc: 'Colorido & Divertido' },
    { name: 'Hagarradinhos', color: 'bg-sky-400', text: 'text-white', icon: '☁️', desc: 'Conforto & Soninho' },
  ];

  return (
    <section className="container mx-auto px-6 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div 
            key={brand.name}
            onClick={() => onSelectBrand(brand.name)}
            className={`group cursor-pointer rounded-[2rem] p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 ${isNightMode ? 'glass-dark hover:bg-white/5' : 'glass-premium hover:shadow-xl hover:shadow-indigo-500/10'}`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg ${brand.color}`}>
              {brand.icon}
            </div>
            <div>
              <h3 className={`font-display font-bold text-xl ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>{brand.name}</h3>
              <p className={`text-sm font-medium ${isNightMode ? 'text-gray-400' : 'text-indigo-900/60'}`}>{brand.desc}</p>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`p-2 rounded-full ${isNightMode ? 'bg-white/10' : 'bg-indigo-50'}`}>
                <ArrowRight className={`w-4 h-4 ${isNightMode ? 'text-white' : 'text-indigo-600'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProductCard: React.FC<{ 
  product: Product, 
  onOpenOptions: (p: Product) => void,
  isBestSeller?: boolean,
  isWishlisted: boolean,
  onToggleWishlist: (id: string) => void,
  isPreview?: boolean
}> = ({ product, onOpenOptions, isBestSeller, isWishlisted, onToggleWishlist, isPreview }) => {
  const { isNightMode } = useContext(ThemeContext);
  const getBrandColor = (brand: string) => {
    switch(brand) {
      case 'Kaine': return isNightMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white';
      case 'Dingdang': return 'bg-hotpink-500 text-white';
      case 'Hagarradinhos': return 'bg-sky-400 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className={`group relative rounded-[2rem] p-4 transition-all duration-500 h-full flex flex-col hover:-translate-y-2 ${isNightMode ? 'glass-card-dark hover:shadow-indigo-500/20 border border-indigo-800/50' : 'glass-card hover:shadow-2xl hover:shadow-rose-500/10 border border-white/60'}`}>
      
      {isBestSeller && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center z-20">
          <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Flame className="w-3 h-3 fill-white" /> MAIS VENDIDO
          </span>
        </div>
      )}

      <div className={`relative overflow-hidden rounded-[1.5rem] mb-5 aspect-square cursor-pointer ${isNightMode ? 'bg-gray-800' : 'bg-white/50'}`} onClick={() => !isPreview && onOpenOptions(product)}>
        <img 
          src={product.image || 'https://via.placeholder.com/500'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500?text=No+Image'; }}
        />
        
        {/* Brand & Kit Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm ${getBrandColor(product.brand)}`}>
            {product.brand}
          </span>
          {product.isKit && (
            <span className="text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg shadow-lg bg-moon-400 text-gray-900 flex items-center gap-1">
              <Package className="w-3 h-3" /> KIT
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        {!isPreview && (
            <button
                onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors hover:scale-110 active:scale-95 z-20"
            >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
        )}
        
        {/* Quick Action Buttons (Bottom Right) */}
        {!isPreview && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300 z-20">
                {/* Quick View Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onOpenOptions(product); }}
                    className="bg-white text-gray-600 p-3 rounded-full shadow-xl hover:bg-sky-100 hover:text-sky-600 transition-colors group/eye"
                    title="Olhadinha Rápida"
                >
                    <Eye className="w-5 h-5" />
                    {/* Tooltip */}
                    <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/eye:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                        Olhadinha
                    </span>
                </button>

                {/* Quick Add Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onOpenOptions(product); }}
                    className="bg-sky-500 text-white p-3 rounded-full shadow-xl hover:bg-sky-600 transition-colors"
                    title="Adicionar ao Carrinho"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col px-2 pb-2">
        <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isNightMode ? 'bg-white/10 text-gray-400' : 'bg-indigo-50 text-indigo-400'}`}>{product.occasion || 'Geral'}</span>
        </div>
        <h3 
            className={`font-display font-bold text-xl mb-2 leading-tight flex-1 group-hover:text-sky-500 transition-colors cursor-pointer ${isNightMode ? 'text-gray-100' : 'text-indigo-950'}`}
            onClick={() => !isPreview && onOpenOptions(product)}
        >
            {product.name || 'Nome do Produto'}
        </h3>
        <div className={`flex justify-between items-end mt-2 pt-4 border-t border-dashed ${isNightMode ? 'border-white/10' : 'border-indigo-100'}`}>
          <div>
            <span className="text-2xl font-bold text-hotpink-500">R$ {Number(product.price).toFixed(2)}</span>
            {product.isKit && <span className="block text-[10px] text-green-500 font-bold mt-1">Economia de 15%</span>}
          </div>
          <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
            {product.sizes?.slice(0, 2).map(s => (
              <span key={s} className={`text-xs font-bold border rounded-md px-1.5 py-1 ${isNightMode ? 'border-gray-600 text-gray-400' : 'border-indigo-100 text-indigo-400'}`}>{s}</span>
            ))}
            {product.sizes?.length > 2 && <span className="text-xs text-gray-400 py-1">+</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductOptionModal: React.FC<{
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}> = ({ product, isOpen, onClose, onAddToCart }) => {
  const { isNightMode } = useContext(ThemeContext);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors?.[0] || '');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    onAddToCart(product, selectedSize, selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`relative rounded-[2.5rem] w-full max-w-3xl shadow-2xl animate-slide-up overflow-hidden flex flex-col md:flex-row max-h-[90vh] ${isNightMode ? 'bg-slate-900 border border-white/10' : 'bg-white/95'}`}>
        
        {/* Image Side */}
        <div className="md:w-1/2 bg-gray-100 relative min-h-[300px]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover absolute inset-0" />
          <button onClick={onClose} className="absolute top-4 left-4 bg-white/50 hover:bg-white backdrop-blur p-2 rounded-full transition-colors md:hidden z-20">
            <X className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Details Side */}
        <div className="md:w-1/2 p-8 overflow-y-auto relative">
          <button onClick={onClose} className={`absolute top-6 right-6 p-2 rounded-full transition-colors hidden md:block ${isNightMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
            <X className={`w-6 h-6 ${isNightMode ? 'text-gray-400' : 'text-gray-400 hover:text-gray-800'}`} />
          </button>
          
          <div className="mb-8 pt-2">
            <span className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2 block">{product.brand}</span>
            <h3 className={`font-display font-bold text-3xl leading-tight mb-3 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-hotpink-500">R$ {product.price.toFixed(2)}</span>
              {product.isKit && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Kit Econômico
                </span>
              )}
            </div>
            <p className={`leading-relaxed text-base ${isNightMode ? 'text-gray-400' : 'text-gray-600'}`}>{product.description}</p>
          </div>

          {/* Attributes Grid */}
          <div className={`grid grid-cols-2 gap-4 mb-8 p-5 rounded-2xl border ${isNightMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Material</span>
              <p className={`text-sm font-semibold mt-1 ${isNightMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.material}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Cuidados</span>
              <p className={`text-sm font-semibold mt-1 ${isNightMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.care}</p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {/* Size Selection */}
            <div>
              <div className="flex justify-between mb-3">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Tamanho</h4>
                <button className="text-xs text-sky-500 font-bold hover:underline">Tabela de Medidas</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-12 rounded-xl flex items-center justify-center font-bold transition-all text-sm ${
                      selectedSize === size 
                      ? (isNightMode ? 'bg-white text-gray-900 shadow-lg scale-105' : 'bg-gray-900 text-white shadow-lg scale-105') 
                      : (isNightMode ? 'bg-transparent border-2 border-gray-700 text-gray-400 hover:border-gray-500' : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-gray-300')
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h4 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Cor</h4>
              <div className="flex flex-wrap gap-3">
                {product.colors?.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedColor === color
                      ? 'border-moon-400 bg-moon-50 text-gray-900 shadow-md'
                      : (isNightMode ? 'border-gray-700 hover:border-gray-500 text-gray-400 bg-transparent' : 'border-gray-100 hover:border-gray-300 text-gray-600 bg-white')
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className={`btn-hover w-full py-5 rounded-2xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 ${isNightMode ? 'bg-white text-indigo-900 shadow-indigo-900/50' : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-gray-200'}`}
          >
            <ShoppingBag className="w-6 h-6" />
            Adicionar à Sacola
          </button>
        </div>
      </div>
    </div>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemove
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cart: CartItem[], 
  onRemove: (id: string) => void
}) => {
  const { isNightMode } = useContext(ThemeContext);
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`relative w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right ${isNightMode ? 'bg-gray-900 text-white' : 'bg-white/95 backdrop-blur-xl text-gray-900'}`}>
        <div className={`p-8 flex justify-between items-center border-b z-10 ${isNightMode ? 'border-gray-800 bg-gray-900' : 'border-gray-50 bg-white/80'}`}>
          <h2 className={`text-3xl font-display font-bold flex items-center gap-3 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="bg-sky-100 p-2 rounded-xl text-sky-500"><ShoppingCart className="w-6 h-6" /></span>
            Sacola
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isNightMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isNightMode ? 'bg-gray-950' : 'bg-transparent'}`}>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className={`p-6 rounded-full mb-4 ${isNightMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                 <ShoppingBag className="w-12 h-12 opacity-50" />
              </div>
              <p className="text-lg font-medium mb-2">Sua sacola está vazia</p>
              <p className="text-sm text-gray-400 max-w-xs text-center mb-6">Parece que você ainda não escolheu os lookinhos do bebê.</p>
              <button onClick={onClose} className="text-sky-500 font-bold hover:underline">
                Voltar para a loja
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartId} className={`flex gap-4 p-4 rounded-2xl shadow-sm border transition-shadow hover:shadow-md ${isNightMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover bg-gray-100" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                         <h4 className={`font-bold text-sm line-clamp-1 leading-tight ${isNightMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</h4>
                         <button 
                            onClick={() => onRemove(item.cartId)}
                            className="text-gray-300 hover:text-red-500 transition-colors -mr-1"
                         >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">{item.brand}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-[10px] border px-2 py-1 rounded-md font-bold ${isNightMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                        Tam: {item.selectedSize}
                      </span>
                      <span className={`text-[10px] border px-2 py-1 rounded-md font-bold ${isNightMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                        Cor: {item.selectedColor}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-hotpink-500 text-lg">R$ {item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
            <div className={`p-8 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 ${isNightMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-white/80 backdrop-blur'}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-900'}`}>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">Frete</span>
                <span className="text-green-500 font-bold text-sm">Grátis</span>
            </div>
            <div className={`flex justify-between items-end mb-8 pt-4 border-t border-dashed ${isNightMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={`text-xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>Total</span>
                <span className="text-3xl font-display font-bold text-hotpink-500">R$ {total.toFixed(2)}</span>
            </div>
            <button className="btn-hover w-full bg-gradient-to-r from-sky-400 to-sky-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-sky-200 text-lg flex justify-between px-8 items-center">
                <span>Finalizar Compra</span>
                <ArrowRightIcon className="w-5 h-5" />
            </button>
            </div>
        )}
      </div>
    </div>
  );
};
const ArrowRightIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

// --- Collections View (New) ---

const CollectionsView: React.FC<{ 
  products: Product[], 
  onOpenOptions: (p: Product) => void,
  wishlist: string[],
  onToggleWishlist: (id: string) => void,
  viewMode: 'all' | 'wishlist'
}> = ({ products, onOpenOptions, wishlist, onToggleWishlist, viewMode }) => {
  const { isNightMode } = useContext(ThemeContext);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const brands = ['Kaine', 'Dingdang', 'Hagarradinhos'];
  const categories = ['Roupas', 'Kits', 'Festas', 'Pijamas'];
  
  // Helper to handle checkbox toggles
  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    // Wishlist Filter
    if (viewMode === 'wishlist' && !wishlist.includes(product.id)) {
        return false;
    }

    // Brand Filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }

    // Category Filter
    if (selectedCategories.length > 0) {
      const matchesCategory = selectedCategories.some(cat => {
        if (cat === 'Roupas') return !product.isKit && product.occasion !== 'Festa' && product.occasion !== 'Hora de Dormir';
        if (cat === 'Kits') return product.isKit || product.category === 'kit';
        if (cat === 'Festas') return product.occasion === 'Festa';
        if (cat === 'Pijamas') return product.occasion === 'Hora de Dormir' || product.occasion === 'Descanso';
        return false;
      });
      if (!matchesCategory) return false;
    }

    // Price Filter
    if (priceRange === 'low') return product.price <= 50;
    if (priceRange === 'mid') return product.price > 50 && product.price <= 100;
    if (priceRange === 'high') return product.price > 100;

    return true;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0; // Relevance (default order)
  });

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters - Desktop */}
        <div className={`hidden lg:block w-64 shrink-0 sticky top-28 h-fit transition-all duration-500 rounded-3xl p-6 border ${isNightMode ? 'glass-dark border-white/10' : 'glass-premium border-white/80'}`}>
          <div className="flex items-center gap-2 mb-6">
             <ListFilter className="w-5 h-5 text-sky-500" />
             <h3 className={`font-bold text-xl ${isNightMode ? 'text-white' : 'text-gray-800'}`}>Filtros</h3>
          </div>

          {/* Brand Section */}
          <div className="mb-8">
            <h4 className={`font-bold text-sm uppercase tracking-wider mb-4 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Marcas</h4>
            <div className="space-y-3">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-sky-500 border-sky-500' : (isNightMode ? 'border-gray-600 group-hover:border-gray-400' : 'border-gray-300 group-hover:border-sky-300')}`}>
                    {selectedBrands.includes(brand) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleSelection(brand, selectedBrands, setSelectedBrands)}
                  />
                  <span className={`font-medium transition-colors ${selectedBrands.includes(brand) ? (isNightMode ? 'text-white' : 'text-gray-900') : (isNightMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-800')}`}>
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Section */}
          <div className="mb-8">
            <h4 className={`font-bold text-sm uppercase tracking-wider mb-4 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Categorias</h4>
            <div className="space-y-3">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-hotpink-500 border-hotpink-500' : (isNightMode ? 'border-gray-600 group-hover:border-gray-400' : 'border-gray-300 group-hover:border-hotpink-300')}`}>
                    {selectedCategories.includes(cat) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleSelection(cat, selectedCategories, setSelectedCategories)}
                  />
                  <span className={`font-medium transition-colors ${selectedCategories.includes(cat) ? (isNightMode ? 'text-white' : 'text-gray-900') : (isNightMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-800')}`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div>
            <h4 className={`font-bold text-sm uppercase tracking-wider mb-4 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Preço</h4>
            <div className="space-y-2">
               <button 
                  onClick={() => setPriceRange('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${priceRange === 'all' ? (isNightMode ? 'bg-white/10 text-white' : 'bg-sky-50 text-sky-600') : (isNightMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}
               >
                  Todos os preços
               </button>
               <button 
                  onClick={() => setPriceRange('low')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${priceRange === 'low' ? (isNightMode ? 'bg-white/10 text-white' : 'bg-sky-50 text-sky-600') : (isNightMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}
               >
                  Até R$ 50,00
               </button>
               <button 
                  onClick={() => setPriceRange('mid')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${priceRange === 'mid' ? (isNightMode ? 'bg-white/10 text-white' : 'bg-sky-50 text-sky-600') : (isNightMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}
               >
                  R$ 50,00 - R$ 100,00
               </button>
               <button 
                  onClick={() => setPriceRange('high')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${priceRange === 'high' ? (isNightMode ? 'bg-white/10 text-white' : 'bg-sky-50 text-sky-600') : (isNightMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')}`}
               >
                  Acima de R$ 100,00
               </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
             <h2 className={`text-3xl font-display font-bold ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>
                {viewMode === 'wishlist' ? 'Meus Favoritos' : 'Coleções'} 
                <span className={`text-lg font-sans font-normal ml-2 ${isNightMode ? 'text-gray-400' : 'text-indigo-900/60'}`}>
                    ({sortedProducts.length} produtos)
                </span>
             </h2>
             
             <div className="flex gap-4 w-full md:w-auto">
                {/* Mobile Filter Toggle */}
                <button 
                   onClick={() => setIsFilterOpen(!isFilterOpen)}
                   className={`lg:hidden flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold border transition-colors ${isNightMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
                >
                   <Filter className="w-4 h-4" /> Filtros
                </button>

                <div className="relative flex-1 md:w-48">
                   <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl font-bold border outline-none cursor-pointer ${isNightMode ? 'bg-gray-800 border-gray-700 text-white focus:border-sky-500' : 'bg-white/80 border-white/50 text-gray-700 focus:border-sky-500'}`}
                   >
                      <option value="relevance">Relevância</option>
                      <option value="price_asc">Menor Preço</option>
                      <option value="price_desc">Maior Preço</option>
                   </select>
                   <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
             </div>
          </div>

          {/* Mobile Filter Drawer (Simple Expand for this version) */}
          {isFilterOpen && (
             <div className={`lg:hidden mb-6 p-6 rounded-2xl border ${isNightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center mb-4">
                   <h3 className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Filtrar Por</h3>
                   <button onClick={() => setIsFilterOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                {/* Reusing logic structure roughly for mobile (simplified) */}
                <div className="space-y-6">
                   <div>
                      <p className="font-bold text-xs uppercase text-gray-500 mb-2">Marcas</p>
                      <div className="flex flex-wrap gap-2">
                         {brands.map(b => (
                            <button 
                               key={b}
                               onClick={() => toggleSelection(b, selectedBrands, setSelectedBrands)}
                               className={`px-3 py-1.5 rounded-lg text-sm border ${selectedBrands.includes(b) ? 'bg-sky-500 border-sky-500 text-white' : (isNightMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600')}`}
                            >
                               {b}
                            </button>
                         ))}
                      </div>
                   </div>
                   <div>
                      <p className="font-bold text-xs uppercase text-gray-500 mb-2">Preço</p>
                      <div className="flex flex-wrap gap-2">
                         {['all', 'low', 'mid', 'high'].map(p => (
                            <button 
                               key={p}
                               onClick={() => setPriceRange(p)}
                               className={`px-3 py-1.5 rounded-lg text-sm border ${priceRange === p ? 'bg-hotpink-500 border-hotpink-500 text-white' : (isNightMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600')}`}
                            >
                               {p === 'all' ? 'Todos' : p === 'low' ? 'Até R$50' : p === 'mid' ? 'R$50-100' : '+R$100'}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
              {sortedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onOpenOptions={onOpenOptions}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className={`p-6 rounded-full mb-4 ${isNightMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                 <Search className="w-12 h-12 opacity-30" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>
                  {viewMode === 'wishlist' ? 'Sua lista de desejos está vazia' : 'Nenhum produto encontrado'}
              </h3>
              <p className="text-gray-500">
                  {viewMode === 'wishlist' ? 'Explore a loja e salve seus looks favoritos!' : 'Tente ajustar seus filtros para encontrar o que procura.'}
              </p>
              {viewMode !== 'wishlist' && (
                <button 
                    onClick={() => { setSelectedBrands([]); setSelectedCategories([]); setPriceRange('all'); }}
                    className="mt-6 text-sky-500 font-bold hover:underline"
                >
                    Limpar todos os filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Admin Dashboard Version 2.0 ---

type AdminTab = 'overview' | 'products' | 'import';

const AdminDashboard: React.FC<{ onLogout: () => void, products: Product[], onProductUpdate: () => void }> = ({ onLogout, products, onProductUpdate }) => {
    const { isNightMode } = useContext(ThemeContext);
    const { addToast } = useContext(ToastContext);
    
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    
    // Product Management State
    const [searchTerm, setSearchTerm] = useState('');
    const [formProduct, setFormProduct] = useState<Partial<Product>>({
        name: '',
        price: 0,
        category: 'top',
        brand: 'Kaine',
        image: '',
        description: 'Nova peça incrível para a coleção.',
        sizes: ['2', '4', '6'],
        colors: ['Padrão'],
        occasion: 'Dia a Dia'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Bulk Import State
    const [jsonInput, setJsonInput] = useState('');
    const [stagingProducts, setStagingProducts] = useState<Partial<Product>[]>([]);
    const [selectedImportIndices, setSelectedImportIndices] = useState<number[]>([]);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto? Essa ação não pode ser desfeita.')) {
            await deleteProduct(id);
            addToast('Produto removido com sucesso.', 'info');
            onProductUpdate();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem é grande! O sistema irá comprimi-la automaticamente para caber no banco de dados.");
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Resize Logic
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              // Compress to 70% quality JPEG
              const base64 = canvas.toDataURL('image/jpeg', 0.7);
              setFormProduct({ ...formProduct, image: base64 });
              addToast("Imagem carregada e otimizada!", 'success');
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    };

    const handleAddProduct = async () => {
        if (!formProduct.name || !formProduct.price) {
            alert("Preencha os campos obrigatórios (Nome e Preço)");
            return;
        }
        
        await addProduct({
            ...formProduct as Product,
            sizes: formProduct.sizes || ['2', '4', '6'],
            colors: formProduct.colors || ['Padrão'],
            material: formProduct.material || 'Algodão',
            care: formProduct.care || 'Lavagem normal'
        });
        
        addToast('Produto adicionado com sucesso!', 'success');
        onProductUpdate();
        // Reset form
        setFormProduct({
            name: '',
            price: 0,
            category: 'top',
            brand: 'Kaine',
            image: '',
            description: 'Nova peça incrível para a coleção.',
            sizes: ['2', '4', '6'],
            colors: ['Padrão'],
            occasion: 'Dia a Dia'
        });
    };

    const handleAnalyzeImport = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) {
                alert("O JSON deve ser uma lista de produtos (Array).");
                return;
            }
            setStagingProducts(parsed);
            // Select all by default
            setSelectedImportIndices(parsed.map((_, i) => i));
            addToast(`${parsed.length} itens encontrados! Revise abaixo.`, 'info');
        } catch (e) {
            alert("Erro ao ler JSON. Verifique a formatação.");
        }
    };

    const toggleImportSelection = (index: number) => {
        if (selectedImportIndices.includes(index)) {
            setSelectedImportIndices(selectedImportIndices.filter(i => i !== index));
        } else {
            setSelectedImportIndices([...selectedImportIndices, index]);
        }
    };

    const handleCommitImport = async () => {
        if (selectedImportIndices.length === 0) return;
        
        const productsToImport = stagingProducts.filter((_, i) => selectedImportIndices.includes(i));
        
        for (const p of productsToImport) {
            await addProduct({
                ...p as Product,
                // Defaults if missing
                sizes: p.sizes || ['U'],
                colors: p.colors || ['Padrão'],
                brand: p.brand || 'Kaine',
                category: p.category || 'top',
                material: p.material || 'Algodão',
                care: p.care || 'Lavagem normal'
            });
        }
        
        addToast(`${productsToImport.length} produtos importados com sucesso!`, 'success');
        onProductUpdate();
        setStagingProducts([]);
        setJsonInput('');
        setActiveTab('products'); // Redirect to list
    };

    const handlePopulateForm = (product: Product) => {
        setFormProduct({ ...product });
        setActiveTab('products');
        // Optionally scroll to form if needed, but simplified here
    }

    return (
      <div className="container mx-auto px-4 md:px-8 py-8 animate-fade-in pb-24">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div>
             <h2 className={`text-4xl font-display font-bold ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Painel de Controle</h2>
             <p className={`${isNightMode ? 'text-gray-400' : 'text-indigo-900/60'}`}>Versão 2.0 • Gerenciamento Avançado</p>
          </div>
          
          <div className={`flex p-1 rounded-xl ${isNightMode ? 'bg-gray-800/50' : 'bg-white/60 border border-white/50'}`}>
             <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-sky-500 text-white shadow-lg' : (isNightMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800')}`}
             >
                <LayoutDashboard className="w-4 h-4" /> Visão Geral
             </button>
             <button 
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-sky-500 text-white shadow-lg' : (isNightMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800')}`}
             >
                <Package className="w-4 h-4" /> Gerenciar Produtos
             </button>
             <button 
                onClick={() => setActiveTab('import')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'import' ? 'bg-sky-500 text-white shadow-lg' : (isNightMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800')}`}
             >
                <FileJson className="w-4 h-4" /> Importação em Massa
             </button>
          </div>

          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm border border-transparent hover:border-red-100">
             <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
            <div className="animate-slide-up">
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className={`p-8 rounded-[2rem] shadow-sm border flex items-center justify-between group hover:shadow-md transition-shadow ${isNightMode ? 'bg-white/5 border-white/10' : 'glass-card'}`}>
                        <div>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2">Vendas Hoje</p>
                            <h3 className={`text-4xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>R$ 1.250</h3>
                            <p className="text-green-500 text-sm font-bold mt-2 flex items-center gap-1">
                                <span className="bg-green-100 px-2 py-0.5 rounded text-xs">+12%</span> vs ontem
                            </p>
                        </div>
                        <div className="bg-sky-50 p-4 rounded-2xl group-hover:bg-sky-100 transition-colors">
                            <BarChart3 className="w-8 h-8 text-sky-500" />
                        </div>
                    </div>
                    
                    <div className={`p-8 rounded-[2rem] shadow-sm border flex items-center justify-between group hover:shadow-md transition-shadow ${isNightMode ? 'bg-white/5 border-white/10' : 'glass-card'}`}>
                        <div>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2">Visitas</p>
                            <h3 className={`text-4xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>3,402</h3>
                            <p className="text-gray-400 text-sm mt-2">
                            +5% nesta semana
                            </p>
                        </div>
                        <div className="bg-moon-50 p-4 rounded-2xl group-hover:bg-moon-100 transition-colors">
                            <User className="w-8 h-8 text-moon-500" />
                        </div>
                    </div>

                    <div className={`p-8 rounded-[2rem] shadow-sm border flex items-center justify-between group hover:shadow-md transition-shadow ${isNightMode ? 'bg-white/5 border-white/10' : 'glass-card'}`}>
                        <div>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2">Total Produtos</p>
                            <h3 className={`text-4xl font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>{products.length}</h3>
                            <p className="text-sky-500 text-sm font-bold mt-2 cursor-pointer hover:underline">
                                Em estoque
                            </p>
                        </div>
                        <div className="bg-hotpink-50 p-4 rounded-2xl group-hover:bg-hotpink-100 transition-colors">
                            <ShoppingBag className="w-8 h-8 text-hotpink-500" />
                        </div>
                    </div>
                </div>
                <div className={`p-10 text-center rounded-3xl border border-dashed ${isNightMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Gráficos detalhados em breve...</p>
                </div>
            </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
            <div className="space-y-8 animate-slide-up">
                {/* SMART FORM */}
                <div className={`rounded-[3rem] p-8 md:p-12 border shadow-xl relative overflow-hidden ${isNightMode ? 'bg-gray-900 border-gray-700' : 'glass-premium border-white/80'}`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-3 bg-sky-100 rounded-xl text-sky-600">
                            <Edit2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className={`text-2xl font-bold ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Adicionar / Editar Produto</h3>
                            <p className="text-gray-500 text-sm">Preencha os dados para atualizar sua vitrine.</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 relative z-10">
                        {/* LEFT: INPUTS */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Nome</label>
                                    <input 
                                        type="text" 
                                        value={formProduct.name}
                                        onChange={e => setFormProduct({...formProduct, name: e.target.value})}
                                        className={`w-full p-4 rounded-xl border font-bold outline-none focus:ring-2 focus:ring-sky-400 transition-all ${isNightMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
                                        placeholder="Ex: Vestido Estelar"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Preço (R$)</label>
                                    <input 
                                        type="number" 
                                        value={formProduct.price}
                                        onChange={e => setFormProduct({...formProduct, price: parseFloat(e.target.value) || 0})}
                                        className={`w-full p-4 rounded-xl border font-bold outline-none focus:ring-2 focus:ring-sky-400 transition-all ${isNightMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-wider ml-1 flex items-center gap-2 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <ImageIcon className="w-3 h-3" /> Foto do Produto
                                </label>
                                
                                {!formProduct.image ? (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group ${isNightMode ? 'border-gray-700 hover:border-sky-500 bg-gray-800' : 'border-gray-300 hover:border-sky-500 bg-white'}`}
                                    >
                                        <div className="p-3 rounded-full bg-sky-100 text-sky-500 mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className={`text-sm font-bold ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Clique ou arraste uma foto
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Max 2MB (Redimensionamento Auto)</p>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                ) : (
                                    <div className={`relative w-full p-2 rounded-2xl border ${isNightMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center gap-4`}>
                                        <img 
                                            src={formProduct.image} 
                                            alt="Preview" 
                                            className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                                        />
                                        <div className="flex-1 overflow-hidden">
                                            <p className={`text-sm font-bold truncate ${isNightMode ? 'text-white' : 'text-gray-800'}`}>Imagem Otimizada</p>
                                            <p className="text-xs text-green-500 font-bold">Pronto para salvar</p>
                                        </div>
                                        <button 
                                            onClick={() => setFormProduct({...formProduct, image: ''})}
                                            className="p-2 hover:bg-red-50 rounded-lg group mr-2"
                                            title="Remover Imagem"
                                        >
                                            <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Marca</label>
                                    <select 
                                        value={formProduct.brand}
                                        onChange={e => setFormProduct({...formProduct, brand: e.target.value as any})}
                                        className={`w-full p-4 rounded-xl border font-bold outline-none focus:ring-2 focus:ring-sky-400 transition-all appearance-none ${isNightMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
                                    >
                                        <option value="Kaine">Kaine</option>
                                        <option value="Dingdang">Dingdang</option>
                                        <option value="Hagarradinhos">Hagarradinhos</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isNightMode ? 'text-gray-400' : 'text-gray-500'}`}>Categoria</label>
                                    <select 
                                        value={formProduct.category}
                                        onChange={e => setFormProduct({...formProduct, category: e.target.value as any})}
                                        className={`w-full p-4 rounded-xl border font-bold outline-none focus:ring-2 focus:ring-sky-400 transition-all appearance-none ${isNightMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
                                    >
                                        <option value="top">Parte de Cima</option>
                                        <option value="bottom">Parte de Baixo</option>
                                        <option value="fullbody">Corpo Inteiro</option>
                                        <option value="accessory">Acessório</option>
                                        <option value="kit">Kit / Conjunto</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={handleAddProduct}
                                className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-xl shadow-sky-200 bg-gradient-to-r from-sky-400 to-sky-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <Save className="w-5 h-5" /> Salvar Produto
                            </button>
                        </div>

                        {/* RIGHT: LIVE PREVIEW */}
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Pré-visualização em Tempo Real</p>
                            <div className="w-80 h-[450px] pointer-events-none select-none transform scale-100 hover:scale-100">
                                <ProductCard 
                                    product={formProduct as Product} 
                                    onOpenOptions={() => {}} 
                                    isBestSeller={false}
                                    isWishlisted={false}
                                    onToggleWishlist={() => {}}
                                    isPreview={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* INVENTORY TABLE */}
                <div className={`rounded-[2.5rem] shadow-sm border overflow-hidden flex flex-col ${isNightMode ? 'bg-gray-900 border-gray-700' : 'glass-premium border-white/80'}`}>
                    <div className={`p-8 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${isNightMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-white/50'}`}>
                        <h3 className={`text-xl font-bold flex items-center gap-2 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>
                            <Package className="w-5 h-5" /> Inventário
                        </h3>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Buscar por nome..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl font-medium outline-none border transition-all focus:ring-2 focus:ring-sky-400 ${isNightMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-700'}`}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[400px] scrollbar-thin">
                        <table className="w-full text-left border-collapse">
                            <thead className={`sticky top-0 z-10 ${isNightMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                                <tr>
                                    <th className="p-6 text-xs font-bold uppercase tracking-wider">Produto</th>
                                    <th className="p-6 text-xs font-bold uppercase tracking-wider">Preço</th>
                                    <th className="p-6 text-xs font-bold uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/10">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className={`group transition-colors ${isNightMode ? 'hover:bg-white/5 divide-gray-800' : 'hover:bg-sky-50/50 divide-gray-100'}`}>
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    className="w-10 h-10 rounded-lg object-cover shadow-sm bg-gray-100"
                                                />
                                                <div>
                                                    <p className={`font-bold text-sm ${isNightMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-800'}`}>R$ {product.price.toFixed(2)}</span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handlePopulateForm(product)}
                                                    className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors" title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* TAB 3: BULK IMPORT */}
        {activeTab === 'import' && (
            <div className="animate-slide-up space-y-8">
                <div className={`rounded-[3rem] p-8 md:p-12 border shadow-xl ${isNightMode ? 'bg-gray-900 border-gray-700' : 'glass-premium border-white/80'}`}>
                    
                    {/* Step 1: Input */}
                    {!stagingProducts.length ? (
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="inline-block p-4 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                                    <FileJson className="w-8 h-8" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Importar Catálogo JSON</h3>
                                <p className="text-gray-500">Cole abaixo o array de produtos para adicionar em massa.</p>
                            </div>
                            
                            <textarea 
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                className={`w-full h-64 p-6 rounded-3xl border font-mono text-sm outline-none focus:ring-2 focus:ring-sky-400 transition-all resize-none mb-6 ${isNightMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}
                                placeholder='[ { "name": "Camiseta", "price": 49.90, ... }, ... ]'
                            />

                            <button 
                                onClick={handleAnalyzeImport}
                                disabled={!jsonInput}
                                className="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Analisar JSON
                            </button>
                        </div>
                    ) : (
                        /* Step 2 & 3: Staging & Commit */
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-xl font-bold ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>
                                    Revisão ({stagingProducts.length} itens)
                                </h3>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setStagingProducts([])}
                                        className="px-4 py-2 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleCommitImport}
                                        disabled={selectedImportIndices.length === 0}
                                        className="px-6 py-2 rounded-xl bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                    >
                                        Salvar {selectedImportIndices.length} Produtos
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                                {stagingProducts.map((product, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => toggleImportSelection(idx)}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                                            selectedImportIndices.includes(idx) 
                                            ? (isNightMode ? 'bg-indigo-900/30 border-indigo-500' : 'bg-indigo-50 border-indigo-500') 
                                            : (isNightMode ? 'bg-gray-800 border-gray-700 opacity-60' : 'bg-white border-gray-200 opacity-60')
                                        }`}
                                    >
                                        <div className="absolute top-4 right-4">
                                            {selectedImportIndices.includes(idx) 
                                                ? <CheckSquare className="w-6 h-6 text-indigo-500 fill-indigo-100" />
                                                : <Square className="w-6 h-6 text-gray-400" />
                                            }
                                        </div>
                                        
                                        <div className="flex items-center gap-3 mb-3">
                                             {product.image ? (
                                                 <img src={product.image} className="w-12 h-12 rounded-lg object-cover bg-gray-200" alt="" />
                                             ) : (
                                                 <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-400" /></div>
                                             )}
                                             <div>
                                                 <h4 className={`font-bold text-sm line-clamp-1 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>{product.name || 'Sem nome'}</h4>
                                                 <p className="text-xs text-gray-500">{product.brand || 'Marca Padrão'}</p>
                                             </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-sm">
                                            <span className={`font-bold ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>R$ {Number(product.price || 0).toFixed(2)}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs border ${isNightMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'}`}>{product.category || 'geral'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    );
};

const LoginScreen: React.FC<{
  onLoginSuccess: (isAdmin: boolean) => void;
  onCancel: () => void;
}> = ({ onLoginSuccess, onCancel }) => {
  const { isNightMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    
    // SMART ROUTING LOGIC
    // Check for Admin Credentials
    if (email === 'admin@luababy.com' && password === '252@Selu') {
        onLoginSuccess(true); // Is Admin
    } else if (email && password) {
        // Generic Customer Login
        onLoginSuccess(false); // Is Customer
    } else {
        setError('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
      <div className={`p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center relative ${isNightMode ? 'glass-dark border-white/10' : 'glass-premium'}`}>
        <button onClick={onCancel} className={`absolute top-6 right-6 transition-colors ${isNightMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}>
            <X className="w-6 h-6" />
        </button>

        <div className="mb-8 flex justify-center">
           <div className={`p-4 rounded-full shadow-lg bg-sky-100 text-sky-500`}>
                <User className="w-8 h-8" />
           </div>
        </div>
        
        <h2 className={`text-3xl font-display font-bold mb-2 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>
          Acesse sua conta
        </h2>
        <p className="text-gray-500 mb-8">
          Bem-vindo de volta! Entre para ver seus pedidos.
        </p>

        <div className="space-y-4 mb-8">
          <input 
            type="text" 
            placeholder="Email"
            className={`w-full p-4 border rounded-2xl focus:border-sky-400 outline-none transition-colors font-medium placeholder-gray-400 ${isNightMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Senha"
            className={`w-full p-4 border rounded-2xl focus:border-sky-400 outline-none transition-colors font-medium placeholder-gray-400 ${isNightMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm rounded-2xl font-bold flex items-center gap-2 justify-center">
            <AlertTriangle className="w-4 h-4" /> {error}
          </div>
        )}

        <button 
          onClick={handleLogin}
          className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all shadow-xl hover:scale-[1.02] active:scale-95 bg-sky-400 hover:bg-sky-500 shadow-sky-200`}
        >
          Entrar
        </button>
      </div>
    </div>
  );
};


// --- Main App ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]); // Wishlist State
  const [starsFound, setStarsFound] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [toasts, setToasts] = useState<{id: number, msg: string, type: 'success'|'info'}[]>([]);
  
  // Night Mode State
  const [isNightMode, setIsNightMode] = useState(false);

  // Options Modal State
  const [selectedProductForOptions, setSelectedProductForOptions] = useState<Product | null>(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  // Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const loadData = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToast = (msg: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, size: string, color: string) => {
    const newItem: CartItem = {
      ...product,
      cartId: Math.random().toString(36).substr(2, 9),
      selectedSize: size,
      selectedColor: color
    };
    setCart([...cart, newItem]);
    addToast(`Adicionado à sacola: ${product.name}`);
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
        setWishlist(wishlist.filter(id => id !== productId));
        addToast("Removido dos favoritos", 'info');
    } else {
        setWishlist([...wishlist, productId]);
        addToast("Adicionado aos favoritos! ❤️", 'success');
    }
  };

  const handleOpenOptions = (product: Product) => {
    setSelectedProductForOptions(product);
    setIsOptionsModalOpen(true);
  };

  const handleStarFound = () => {
    const newCount = starsFound + 1;
    setStarsFound(newCount);
    addToast("Você encontrou uma estrela! ⭐", 'info');
    if (newCount === 3) {
      setShowConfetti(true);
      setTimeout(() => {
          alert("🎉 PARABÉNS! Você encontrou todas as estrelas! Use o cupom ASTRO10 para 10% de desconto!");
          setShowConfetti(false);
      }, 1000);
    }
  };

  // Consolidated Login Handler
  const handleLogin = (isAdmin: boolean) => {
    if (isAdmin) {
      setIsAdminAuthenticated(true);
      setCurrentView(ViewState.ADMIN);
      addToast("Bem-vindo, Chefe! 🚀", 'success');
    } else {
      setCurrentView(ViewState.HOME);
      addToast("Bem-vindo de volta!", 'success');
    }
  };

  return (
    <ThemeContext.Provider value={{ isNightMode }}>
        <ToastContext.Provider value={{ addToast }}>
            <div className={`min-h-screen pb-20 relative transition-theme ${isNightMode ? 'bg-night' : 'bg-day'}`}>
            
            {/* Background Elements */}
            {isNightMode ? <NightSky /> : <TwilightAmbience />}

            {/* Toasts */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Confetti placeholder */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-[200] flex justify-center items-start pt-20">
                    <div className="text-center animate-bounce">
                        <span className="text-6xl drop-shadow-2xl">🎊 ⭐ 🎊</span>
                    </div>
                </div>
            )}

            {/* Hidden Stars & Badge */}
            <StarHunt totalStarsFound={starsFound} onStarFound={handleStarFound} />
            <div className="hidden lg:block relative w-full h-0">
                <div className="absolute top-[800px] right-10 opacity-80 hover:opacity-100 transition-opacity"><StarHunt totalStarsFound={starsFound} onStarFound={handleStarFound} /></div>
                <div className="absolute top-[1200px] left-20 opacity-80 hover:opacity-100 transition-opacity"><StarHunt totalStarsFound={starsFound} onStarFound={handleStarFound} /></div>
            </div>
            <FloatingStarBadge count={starsFound} />

            <Navbar 
                cartCount={cart.length}
                wishlistCount={wishlist.length}
                currentView={currentView} 
                setView={(view) => {
                    // STEALTH ADMIN: "Admin" viewstate triggers login modal if not authenticated
                    if (view === ViewState.ADMIN) {
                        if (isAdminAuthenticated) {
                             setCurrentView(ViewState.ADMIN);
                        } else {
                             setCurrentView(ViewState.LOGIN);
                        }
                    } else {
                        setCurrentView(view);
                    }
                }}
                toggleCart={() => setIsCartOpen(true)}
                isNightMode={isNightMode}
                toggleTheme={() => setIsNightMode(!isNightMode)}
            />

            <ProductOptionModal 
                product={selectedProductForOptions}
                isOpen={isOptionsModalOpen}
                onClose={() => setIsOptionsModalOpen(false)}
                onAddToCart={addToCart}
            />

            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cart={cart} 
                onRemove={removeFromCart}
            />

            <main className="relative z-10 transition-all duration-500 ease-in-out">
                {currentView === ViewState.HOME && (
                <>
                    <Hero onCtaClick={() => { document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' }) }} />
                    
                    {/* SECTION C: BRAND EXPLORER */}
                    <BrandExplorer onSelectBrand={(b) => console.log("Selected Brand:", b)} />

                    {/* SECTION A: BEST SELLERS */}
                    <section id="best-sellers" className="container mx-auto px-6 mb-20">
                      <div className="flex justify-between items-end mb-8">
                        <div>
                          <h2 className={`text-3xl font-display font-bold ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Os Queridinhos</h2>
                          <p className={`${isNightMode ? 'text-gray-400' : 'text-indigo-900/60'}`}>As peças mais amadas pelas mamães e papais.</p>
                        </div>
                        <div className="hidden md:block">
                            <div className={`flex items-center gap-2 text-sm font-bold ${isNightMode ? 'text-sky-400' : 'text-indigo-600'}`}>
                                Deslize para ver mais <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                         {products.slice(0, 5).map((product) => (
                            <div key={product.id} className="snap-start shrink-0 w-72 md:w-80">
                                <ProductCard 
                                    product={product} 
                                    onOpenOptions={handleOpenOptions} 
                                    isBestSeller={true}
                                    isWishlisted={wishlist.includes(product.id)}
                                    onToggleWishlist={toggleWishlist}
                                />
                            </div>
                         ))}
                      </div>
                    </section>

                    {/* SECTION B: HOLIDAY SPECIAL (Gold/Sparkle) */}
                    <section className="container mx-auto px-6 mb-20">
                      <div className={`rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-xl border border-yellow-100 ${isNightMode ? 'bg-gradient-to-br from-yellow-900/40 to-purple-950 border-yellow-500/20' : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-white border-white/60'}`}>
                        {/* Gold Sparkles BG */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full blur-[2px] animate-pulse"></div>
                            <div className="absolute bottom-20 right-20 w-6 h-6 bg-yellow-300 rounded-full blur-[4px] animate-pulse delay-700"></div>
                            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        </div>

                        <div className="relative z-10 mb-10 text-center">
                           <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-lg">
                              <Sparkles className="w-4 h-4" /> Edição Limitada
                           </div>
                           <h2 className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isNightMode ? 'text-yellow-100' : 'text-gray-900'}`}>
                             Brilhe nas Festas
                           </h2>
                           <p className={`text-lg max-w-2xl mx-auto ${isNightMode ? 'text-yellow-200/80' : 'text-gray-600'}`}>
                             Looks deslumbrantes com toques de dourado e tecidos nobres para celebrar momentos inesquecíveis.
                           </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                           {products.filter(p => p.occasion === 'Festa').slice(0, 3).map(product => (
                              <ProductCard 
                                key={product.id} 
                                product={product} 
                                onOpenOptions={handleOpenOptions} 
                                isWishlisted={wishlist.includes(product.id)}
                                onToggleWishlist={toggleWishlist}
                              />
                           ))}
                        </div>
                      </div>
                    </section>

                    {/* Kits & Conjuntos Highlight Section (Preserved) */}
                    <section className="container mx-auto px-6 py-16">
                        <div className={`rounded-[3rem] p-10 lg:p-20 text-white relative overflow-hidden shadow-2xl group ${isNightMode ? 'bg-gradient-to-br from-indigo-900 to-purple-950 border border-white/10' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
                            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                                <div className="lg:w-1/2">
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold mb-6 border border-white/20">
                                        <Sparkles className="w-4 h-4 text-yellow-300" /> ECONOMIA INTELIGENTE
                                    </div>
                                    <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-tight">Leve Mais, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Pague Menos</span></h2>
                                    <p className="text-indigo-100 text-lg mb-10 leading-relaxed max-w-md">
                                        Nossos conjuntos coordenados são perfeitos para renovar o guarda-roupa. Praticidade e estilo em uma única compra com <b>15% OFF</b>.
                                    </p>
                                    <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-white/20 transform hover:-translate-y-1">
                                        Ver Todos os Kits
                                    </button>
                                </div>
                                <div className="lg:w-1/2 flex gap-6 justify-center perspective-1000">
                                    {products.filter(p => p.isKit).slice(0, 2).map((kit, idx) => (
                                        <div 
                                            key={kit.id} 
                                            onClick={() => handleOpenOptions(kit)} 
                                            className={`w-56 rounded-3xl p-4 shadow-2xl text-gray-800 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:rotate-0 ${idx === 0 ? '-rotate-6 translate-y-4' : 'rotate-6'} ${isNightMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
                                        >
                                            <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl">
                                                <img src={kit.image} className="w-full h-full object-cover" alt={kit.name} />
                                            </div>
                                            <p className={`font-bold text-sm truncate ${isNightMode ? 'text-white' : 'text-gray-900'}`}>{kit.name}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-hotpink-500 font-bold">R$ {kit.price.toFixed(2)}</p>
                                                <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Background decorations */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl group-hover:opacity-10 transition-opacity duration-1000"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-hotpink-500 opacity-30 rounded-full translate-y-1/3 -translate-x-1/4 blur-[80px]"></div>
                        </div>
                    </section>
                </>
                )}

                {(currentView === ViewState.COLLECTIONS || currentView === ViewState.WISHLIST) && (
                    <CollectionsView 
                        products={products}
                        onOpenOptions={handleOpenOptions}
                        wishlist={wishlist}
                        onToggleWishlist={toggleWishlist}
                        viewMode={currentView === ViewState.WISHLIST ? 'wishlist' : 'all'}
                    />
                )}

                {currentView === ViewState.MIX_MATCH && (
                    <MixMatchStudio products={products} onAddToCart={addToCart} />
                )}

                {currentView === ViewState.GEMINI_TOOLS && (
                    <GeminiTools />
                )}

                {currentView === ViewState.LOGIN && (
                    <LoginScreen 
                        onLoginSuccess={handleLogin} 
                        onCancel={() => setCurrentView(ViewState.HOME)} 
                    />
                )}

                {/* Security: Only render AdminDashboard if actually authenticated */}
                {currentView === ViewState.ADMIN && isAdminAuthenticated && (
                <AdminDashboard 
                    onLogout={() => {
                        setIsAdminAuthenticated(false);
                        setCurrentView(ViewState.HOME); // Exit to Home
                        addToast("Você saiu da área administrativa.", 'info');
                    }}
                    products={products}
                    onProductUpdate={loadData}
                />
                )}
            </main>

            {/* Footer */}
            <footer className={`border-t pt-20 pb-10 mt-20 transition-colors ${isNightMode ? 'bg-gray-900 border-gray-800' : 'bg-white/60 border-white/50'}`}>
                <div className="container mx-auto px-6 text-center">
                <div className="flex justify-center items-center gap-3 mb-8 opacity-70 hover:opacity-100 transition-opacity duration-500">
                    <Sparkles className={`w-8 h-8 animate-pulse ${isNightMode ? 'text-yellow-300' : 'text-moon-400'}`} />
                    <h2 className="text-3xl font-display font-bold text-sky-500">Lua<span className="text-moon-400">Baby</span></h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12 text-left md:text-center">
                    <div>
                        <h4 className={`font-bold mb-4 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Sobre Nós</h4>
                        <ul className={`space-y-2 ${isNightMode ? 'text-gray-400' : 'text-indigo-900/60'}`}>
                            <li><a href="#" className="hover:text-sky-500">Nossa História</a></li>
                            <li><a href="#" className="hover:text-sky-500">Sustentabilidade</a></li>
                            <li><a href="#" className="hover:text-sky-500">Trabalhe Conosco</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={`font-bold mb-4 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Ajuda</h4>
                        <ul className={`space-y-2 ${isNightMode ? 'text-gray-400' : 'text-indigo-900/60'}`}>
                            <li><a href="#" className="hover:text-sky-500">Frete e Entregas</a></li>
                            <li><a href="#" className="hover:text-sky-500">Trocas e Devoluções</a></li>
                            <li><a href="#" className="hover:text-sky-500">Guia de Tamanhos</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={`font-bold mb-4 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Contato</h4>
                        <ul className={`space-y-2 ${isNightMode ? 'text-gray-400' : 'text-indigo-900/60'}`}>
                            <li className="flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> Chat Online</li>
                            <li>sac@luababy.com.br</li>
                            <li>(11) 99999-9999</li>
                        </ul>
                    </div>
                </div>
                <div className={`border-t pt-8 ${isNightMode ? 'border-gray-800' : 'border-white/30'}`}>
                    <p className={`${isNightMode ? 'text-gray-400' : 'text-indigo-900/40'} text-sm`}>Feito com amor e poeira estelar ✨ © 2025 Lua Baby</p>
                </div>
                </div>
            </footer>

            {/* Floating Chat Widget */}
            <div className="fixed bottom-6 right-6 z-[100] group">
                <button className="bg-hotpink-500 text-white p-4 rounded-full shadow-xl shadow-hotpink-200 hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-bounce hover:animate-none">
                    <MessageCircle className="w-7 h-7" />
                </button>
                {/* // WEBHOOK N8N URL HERE */}
                <div className={`absolute bottom-20 right-0 p-5 rounded-2xl shadow-2xl w-72 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 origin-bottom-right pointer-events-none group-hover:pointer-events-auto border ${isNightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-start gap-3">
                        <div className="bg-sky-100 p-2 rounded-full"><User className="w-5 h-5 text-sky-500" /></div>
                        <div>
                            <p className={`font-bold text-sm mb-1 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>Oi! Posso ajudar?</p>
                            <p className={`text-sm leading-snug ${isNightMode ? 'text-gray-300' : 'text-gray-500'}`}>Estou aqui para te ajudar a escolher o lookinho perfeito!</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </ToastContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
