import React, { useState } from 'react';
import { X, Ruler, Weight, Calculator, Sparkles } from 'lucide-react';

interface SizeCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
}

const SizeCalculator: React.FC<SizeCalculatorProps> = ({ isOpen, onClose }) => {
    const [height, setHeight] = useState(100);
    const [weight, setWeight] = useState(15);
    const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

    if (!isOpen) return null;

    const calculateSize = () => {
        let size = '';
        if (height < 90) size = '2';
        else if (height < 105) size = '4';
        else if (height < 120) size = '6';
        else size = '8+';

        setRecommendedSize(size);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
                <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                    <Calculator className="w-12 h-12 mx-auto mb-2 opacity-90" />
                    <h2 className="text-2xl font-display font-bold">Descubra o Tamanho Ideal</h2>
                    <p className="opacity-90">Para os pequenos crescerem com conforto!</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <label className="flex justify-between font-bold text-gray-700 dark:text-gray-300">
                            <span className="flex items-center gap-2"><Ruler className="w-5 h-5 text-sky-500" /> Altura (cm)</span>
                            <span className="text-sky-600">{height} cm</span>
                        </label>
                        <input
                            type="range"
                            min="50"
                            max="160"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="flex justify-between font-bold text-gray-700 dark:text-gray-300">
                            <span className="flex items-center gap-2"><Weight className="w-5 h-5 text-hotpink-500" /> Peso (kg)</span>
                            <span className="text-hotpink-600">{weight} kg</span>
                        </label>
                        <input
                            type="range"
                            min="3"
                            max="50"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-hotpink-500"
                        />
                    </div>

                    {recommendedSize && (
                        <div className="bg-sky-50 dark:bg-sky-900/30 border-2 border-sky-200 dark:border-sky-700 rounded-2xl p-6 text-center animate-fade-in">
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Tamanho Recomendado</p>
                            <div className="flex items-center justify-center gap-2">
                                <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                                <span className="text-4xl font-bold text-sky-600 dark:text-sky-400">Tamanho {recommendedSize}</span>
                                <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={calculateSize}
                        className="w-full py-4 bg-gradient-to-r from-hotpink-500 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Calcular Tamanho
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SizeCalculator;
