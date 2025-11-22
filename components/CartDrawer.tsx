import React from 'react';
import { X, Trash2, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const CartDrawer: React.FC<{ isOpen: boolean, onClose: () => void, cart: CartItem[], onRemove: (id: string) => void, clearCart: () => void }> = ({ isOpen, onClose, cart, onRemove, clearCart }) => {
    const { isNightMode } = useTheme();
    const total = cart.reduce((acc, item) => acc + item.price, 0);

    if (!isOpen) return null;

    const handleWhatsAppCheckout = () => {
        const phoneNumber = "5511999999999"; // Placeholder
        let message = "Olá! Quero finalizar meu pedido na Lua Baby:\n\n";

        cart.forEach(item => {
            message += `1x ${item.name} (Tam: ${item.selectedSize}, Cor: ${item.selectedColor}) - R$ ${item.price.toFixed(2)}\n`;
        });

        message += `\nTotal: R$ ${total.toFixed(2)}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[150] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className={`relative w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right ${isNightMode ? 'bg-gray-900 text-white' : 'bg-white/95 backdrop-blur-xl text-gray-900'}`}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="font-bold text-xl">Sacola ({cart.length})</h2>
                    <button onClick={onClose} aria-label="Fechar sacola"><X className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">Sua sacola está vazia.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.cartId} className="flex gap-4 mb-4">
                                <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
                                <div className="flex-1">
                                    <p className="font-bold text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.selectedSize} • {item.selectedColor}</p>
                                    <p className="text-sm font-bold text-hotpink-500 mt-1">R$ {item.price.toFixed(2)}</p>
                                </div>
                                <button onClick={() => onRemove(item.cartId)} aria-label={`Remover ${item.name}`}><Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" /></button>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-6 border-t space-y-3">
                    <div className="flex justify-between mb-2 font-bold text-lg">
                        <span>Total</span>
                        <span>R$ {total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleWhatsAppCheckout}
                        disabled={cart.length === 0}
                        className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                    >
                        <MessageCircle className="w-5 h-5" /> Finalizar pelo WhatsApp
                    </button>

                    <button
                        onClick={clearCart}
                        disabled={cart.length === 0}
                        className={`w-full py-3 rounded-xl font-bold border transition-colors ${isNightMode ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                        Limpar Sacola
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
