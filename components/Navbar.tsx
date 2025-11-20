
import React from 'react';
import { ShoppingBag, Menu, Sparkles, Shirt, User, Camera, Sun, Moon, Cloud, Grid, Heart } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  toggleCart: () => void;
  isNightMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, wishlistCount, setView, toggleCart, isNightMode, toggleTheme }) => {
  return (
    <nav className="sticky top-4 z-50 mx-4 transition-all duration-500">
      <div className={`rounded-2xl px-6 py-4 flex justify-between items-center transition-all duration-1000 ${isNightMode ? 'glass-dark' : 'glass'}`}>
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView(ViewState.HOME)}
        >
          <div className="relative">
            <Sparkles className={`w-8 h-8 animate-spin-slow ${isNightMode ? 'text-yellow-300' : 'text-moon-400'}`} />
            <div className="absolute top-0 right-0 w-3 h-3 bg-hotpink-500 rounded-full animate-bounce" />
          </div>
          <h1 className={`text-2xl font-display font-bold tracking-wide group-hover:scale-105 transition-transform ${isNightMode ? 'text-white' : 'text-sky-500'}`}>
            Lua<span className="text-moon-400">Baby</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className={`hidden md:flex gap-8 items-center font-bold transition-colors duration-500 ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <button 
            onClick={() => setView(ViewState.HOME)}
            className={`hover:text-sky-400 transition-colors flex items-center gap-1 ${isNightMode ? 'hover:text-sky-300' : ''}`}
          >
            Início
          </button>
          <button 
            onClick={() => setView(ViewState.COLLECTIONS)}
            className={`hover:text-sky-400 transition-colors flex items-center gap-1 ${isNightMode ? 'hover:text-sky-300' : ''}`}
          >
            <Grid className="w-4 h-4" />
            Coleções
          </button>
          <button 
            onClick={() => setView(ViewState.MIX_MATCH)}
            className="hover:text-hotpink-500 transition-colors flex items-center gap-1"
          >
            <Shirt className="w-4 h-4" />
            Montar Look
          </button>
          <button 
            onClick={() => setView(ViewState.GEMINI_TOOLS)}
            className={`transition-colors flex items-center gap-1 px-3 py-1 rounded-full border ${isNightMode ? 'bg-purple-900/50 border-purple-700 text-purple-300 hover:text-white' : 'bg-purple-100 border-purple-200 text-purple-500 hover:text-purple-600'}`}
          >
            <Camera className="w-4 h-4" />
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Estúdio Mágico</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          
          {/* THEME TOGGLE - WOW FACTOR */}
          <div className="group relative hidden sm:block">
            <button 
              onClick={toggleTheme}
              className={`w-16 h-8 rounded-full p-1 transition-all duration-700 flex items-center shadow-inner relative overflow-hidden ${isNightMode ? 'bg-indigo-950 border border-indigo-800' : 'bg-sky-200 border border-sky-300'}`}
            >
              {/* Background elements for switch */}
              <div className={`absolute inset-0 transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`}>
                 {/* Tiny stars in button */}
                 <div className="absolute top-2 left-3 w-0.5 h-0.5 bg-white rounded-full"></div>
                 <div className="absolute bottom-2 left-6 w-0.5 h-0.5 bg-white rounded-full"></div>
              </div>
              <div className={`absolute inset-0 transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`}>
                 <Cloud className="absolute top-1 right-2 w-3 h-3 text-white fill-white opacity-80" />
              </div>

              {/* The Knob */}
              <div 
                className={`w-6 h-6 rounded-full shadow-md transform transition-all duration-700 flex items-center justify-center z-10 ${isNightMode ? 'translate-x-8 bg-moon-300' : 'translate-x-0 bg-yellow-400'}`}
              >
                {isNightMode ? (
                    <Moon className="w-3 h-3 text-indigo-900 fill-indigo-900" />
                ) : (
                    <Sun className="w-4 h-4 text-yellow-100 fill-yellow-100" />
                )}
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
                onClick={() => setView(ViewState.WISHLIST)}
                className={`relative p-2 rounded-full transition-colors ${isNightMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-sky-50 text-gray-500 hover:text-red-500'}`}
                title="Meus Favoritos"
            >
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                        {wishlistCount}
                    </span>
                )}
            </button>

            <button 
                onClick={() => setView(ViewState.ADMIN)}
                className={`p-2 rounded-full transition-colors ${isNightMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-sky-50 text-gray-500'}`}
            >
                <User className="w-5 h-5" />
            </button>
            
            <button 
                onClick={toggleCart}
                className={`relative p-2 rounded-xl transition-colors shadow-lg ${isNightMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50' : 'bg-sky-400 text-white hover:bg-sky-500 shadow-sky-200'}`}
            >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-hotpink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                </span>
                )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;