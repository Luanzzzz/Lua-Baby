import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import ProductCard from './ProductCard';

const CollectionsPage: React.FC<{
    products: Product[],
    wishlist: string[],
    onToggleWishlist: (id: string) => void,
    viewMode?: 'all' | 'wishlist'
}> = ({ products, wishlist, onToggleWishlist, viewMode = 'all' }) => {
    const { isNightMode } = useTheme();
    const { category } = useParams();

    // Logic reused from CollectionsView but simplified
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const filteredProducts = products.filter(product => {
        if (viewMode === 'wishlist' && !wishlist.includes(product.id)) return false;
        if (category && category !== 'all') {
            // simple category mapping for demo
            if (category === 'roupas' && (product.isKit || product.occasion === 'Festa')) return false;
            if (category === 'kits' && !product.isKit) return false;
        }
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen animate-fade-in">
            <SEO title={viewMode === 'wishlist' ? "Meus Favoritos" : "Coleções"} description="Navegue pelas nossas coleções exclusivas." />
            <h2 className={`text-3xl font-display font-bold mb-8 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>
                {viewMode === 'wishlist' ? 'Favoritos' : (category ? `Coleção: ${category}` : 'Todas as Coleções')}
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Simple Sidebar */}
                <div className={`lg:w-64 p-6 rounded-3xl h-fit border ${isNightMode ? 'glass-dark border-gray-700' : 'glass border-white'}`}>
                    <h3 className={`font-bold mb-4 ${isNightMode ? 'text-white' : 'text-gray-800'}`}>Filtros</h3>
                    {['Kaine', 'Dingdang', 'Hagarradinhos'].map(brand => (
                        <label key={brand} className="flex items-center gap-2 mb-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={(e) => {
                                    if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                                    else setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                }}
                                className="rounded text-sky-500 focus:ring-sky-500"
                            />
                            <span className={isNightMode ? 'text-gray-300' : 'text-gray-600'}>{brand}</span>
                        </label>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isWishlisted={wishlist.includes(product.id)}
                            onToggleWishlist={onToggleWishlist}
                        />
                    )) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            Nenhum produto encontrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionsPage;
