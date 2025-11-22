import React from 'react';
import { Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const FloatingStarBadge: React.FC<{ count: number }> = ({ count }) => {
    const { isNightMode } = useTheme();
    if (count >= 3) return null;
    return (
        <div className="fixed bottom-6 left-6 z-50 animate-float hidden md:block">
            <div className={`px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border group cursor-pointer hover:scale-105 transition-transform ${isNightMode ? 'glass-dark border-indigo-700' : 'glass-premium border-white/80'}`}>
                <Star className="w-8 h-8 text-moon-400 fill-moon-400 drop-shadow-sm" />
                <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isNightMode ? 'text-gray-400' : 'text-indigo-900/60'}`}>Star Hunt</p>
                    <p className={`text-lg font-display font-bold leading-none ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>{count}/3 Encontradas</p>
                </div>
            </div>
        </div>
    );
};

export default FloatingStarBadge;
