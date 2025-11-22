import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
    const { isNightMode } = useTheme();
    return (
        <footer className={`border-t pt-20 pb-10 mt-20 transition-colors ${isNightMode ? 'bg-gray-900 border-gray-800' : 'bg-white/60 border-white/50'}`}>
            <div className="container mx-auto px-6 text-center">
                <p className={`${isNightMode ? 'text-gray-400' : 'text-indigo-900/40'} text-sm`}>Feito com amor e poeira estelar ✨ © 2025 Lua Baby</p>
            </div>
        </footer>
    );
};

export default Footer;
