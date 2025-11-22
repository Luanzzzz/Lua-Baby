import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Heart } from 'lucide-react';
import { Product } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import OptimizedImage from './OptimizedImage';

const ProductCard: React.FC<{
    product: Product,
    isBestSeller?: boolean,
    isWishlisted: boolean,
    onToggleWishlist: (id: string) => void,
    isPreview?: boolean
}> = ({ product, isBestSeller, isWishlisted, onToggleWishlist, isPreview }) => {
    const { isNightMode } = useTheme();
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!isPreview) {
            navigate(`/produto/${product.id}`);
        }
    };

    return (
        <div className={`group relative rounded-[2rem] p-4 transition-all duration-500 h-full flex flex-col hover:-translate-y-2 active:scale-[0.98] ${isNightMode ? 'glass-card-dark hover:shadow-indigo-500/20 border border-indigo-800/50' : 'glass-card hover:shadow-2xl hover:shadow-rose-500/10 border border-white/60'}`}>

            {isBestSeller && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center z-20">
                    <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-white" /> MAIS VENDIDO
                    </span>
                </div>
            )}

            <div
                className={`relative overflow-hidden rounded-[1.5rem] mb-5 aspect-square cursor-pointer ${isNightMode ? 'bg-gray-800' : 'bg-white/50'}`}
                onClick={handleNavigate}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigate(); }}
            >
                <OptimizedImage
                    src={product.image || 'https://via.placeholder.com/500'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {!isPreview && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors hover:scale-110 active:scale-90 z-20"
                        aria-label={isWishlisted ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col px-2 pb-2">
                <h3
                    className={`font-display font-bold text-xl mb-2 leading-tight flex-1 group-hover:text-sky-500 transition-colors cursor-pointer ${isNightMode ? 'text-gray-100' : 'text-indigo-950'}`}
                    onClick={handleNavigate}
                >
                    {product.name || 'Nome do Produto'}
                </h3>
                <div className={`flex justify-between items-end mt-2 pt-4 border-t border-dashed ${isNightMode ? 'border-white/10' : 'border-indigo-100'}`}>
                    <span className="text-2xl font-bold text-hotpink-500">R$ {Number(product.price).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
