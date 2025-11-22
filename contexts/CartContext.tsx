import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    addToCart: (product: Product, size: string, color: string) => void;
    removeFromCart: (cartId: string) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { addToast } = useToast();

    const addToCart = (product: Product, size: string, color: string) => {
        const newItem: CartItem = {
            ...product,
            cartId: Math.random().toString(36).substr(2, 9),
            selectedSize: size,
            selectedColor: color
        };
        setCart(prev => [...prev, newItem]);
        addToast(`Adicionado: ${product.name}`);
        setIsCartOpen(true);
    };

    const removeFromCart = (cartId: string) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const clearCart = () => {
        if (window.confirm("Tem certeza que deseja limpar a sacola?")) {
            setCart([]);
            addToast("Sacola limpa!", 'info');
        }
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const cartCount = cart.length;
    const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

    return (
        <CartContext.Provider value={{
            cart,
            isCartOpen,
            addToCart,
            removeFromCart,
            clearCart,
            toggleCart,
            openCart,
            closeCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
