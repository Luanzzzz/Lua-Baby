import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';

const CheckoutPage: React.FC<{ cart: CartItem[], onRemove: (id: string) => void }> = ({ cart, onRemove }) => {
    const { isNightMode } = useTheme();
    const total = cart.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in min-h-screen">
            <SEO title="Carrinho" description="Finalize sua compra." />
            <h1 className={`text-4xl font-display font-bold mb-8 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Seu Carrinho</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3 space-y-4">
                    {cart.length === 0 ? (
                        <div className={`p-12 rounded-3xl text-center border ${isNightMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <p className="text-gray-500 text-lg">Sua sacola está vazia.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.cartId} className={`flex gap-6 p-6 rounded-3xl border ${isNightMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                                <img src={item.image} className="w-24 h-24 rounded-xl object-cover" alt={item.name} />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                                        <button onClick={() => onRemove(item.cartId)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                    <p className="text-sm text-gray-500">{item.brand} • {item.selectedSize} • {item.selectedColor}</p>
                                    <p className="text-hotpink-500 font-bold text-xl mt-2">R$ {item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="lg:w-1/3">
                        <div className={`p-8 rounded-[2rem] sticky top-24 border ${isNightMode ? 'bg-gray-900 border-gray-700' : 'glass-premium border-white'}`}>
                            <h3 className={`text-xl font-bold mb-6 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Resumo do Pedido</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>R$ {total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-green-500 font-bold">
                                    <span>Frete</span>
                                    <span>Grátis</span>
                                </div>
                                <div className={`flex justify-between text-2xl font-bold pt-4 border-t border-dashed ${isNightMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-300'}`}>
                                    <span>Total</span>
                                    <span>R$ {total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-green-500 text-white rounded-xl font-bold shadow-lg hover:bg-green-600 transition-colors">
                                Finalizar Compra
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
