import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ruler, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import CustomerReviews from './CustomerReviews';
import SizeCalculator from './SizeCalculator';

const ProductPage: React.FC<{ products: Product[], onAddToCart: (p: Product, s: string, c: string) => void }> = ({ products, onAddToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isNightMode } = useTheme();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [isSizeCalculatorOpen, setIsSizeCalculatorOpen] = useState(false);

    useEffect(() => {
        const found = products.find(p => p.id === id);
        if (found) {
            setProduct(found);
            setSelectedSize(found.sizes[0]);
            setSelectedColor(found.colors?.[0]);
        }
    }, [id, products]);

    if (!product) {
        return <div className="min-h-screen pt-32 text-center">Carregando...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen animate-fade-in">
            <SEO title={product.name} description={product.description} />

            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-sky-500 font-bold mb-8">
                <ArrowLeft className="w-5 h-5" /> Voltar
            </button>

            <div className={`flex flex-col lg:flex-row gap-12 rounded-[3rem] p-8 shadow-xl border ${isNightMode ? 'bg-gray-900 border-gray-700' : 'glass-premium border-white/80'}`}>
                <div className="lg:w-1/2">
                    <img src={product.image} alt={product.name} className="w-full rounded-3xl shadow-lg object-cover aspect-square" />
                </div>

                <div className="lg:w-1/2 space-y-8">
                    <div>
                        <span className="text-sky-500 font-bold uppercase tracking-wider text-sm">{product.brand}</span>
                        <h1 className={`text-4xl md:text-5xl font-display font-bold mt-2 mb-4 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>{product.name}</h1>
                        <p className={`text-4xl font-bold text-hotpink-500`}>R$ {product.price.toFixed(2)}</p>
                    </div>

                    <p className={`text-lg leading-relaxed ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>{product.description}</p>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className={`font-bold ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Tamanho</h3>
                                <button
                                    onClick={() => setIsSizeCalculatorOpen(true)}
                                    className="text-sm text-sky-500 font-bold hover:underline flex items-center gap-1"
                                >
                                    <Ruler className="w-4 h-4" /> Guia de Medidas
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-14 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${selectedSize === size
                                            ? 'bg-sky-500 text-white shadow-lg scale-105'
                                            : (isNightMode ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-white border text-gray-500')
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className={`font-bold mb-3 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Cor</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors?.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 rounded-xl font-bold border transition-all ${selectedColor === color
                                            ? 'border-hotpink-500 text-hotpink-500 bg-hotpink-50'
                                            : (isNightMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600')
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border ${isNightMode ? 'bg-gray-800 border-gray-700' : 'bg-sky-50 border-sky-100'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Material</p>
                                <p className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>{product.material}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Cuidados</p>
                                <p className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-800'}`}>{product.care}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onAddToCart(product, selectedSize, selectedColor)}
                        className="w-full py-5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <ShoppingBag className="w-6 h-6" /> Adicionar à Sacola
                    </button>
                </div>
            </div>

            <CustomerReviews />
            <SizeCalculator isOpen={isSizeCalculatorOpen} onClose={() => setIsSizeCalculatorOpen(false)} />
        </div>
    );
};

export default ProductPage;
