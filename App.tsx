import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import StarHunt from './components/StarHunt';
import MixMatchStudio from './components/MixMatchStudio';
import GeminiTools from './components/GeminiTools';
import GeminiStylist from './components/GeminiStylist';
import { Product, CartItem } from './types';
import { getProducts } from './services/firebaseService';

// Contexts
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ToastProvider, useToast } from './contexts/ToastContext';

// Components
import { NightSky, TwilightAmbience } from './components/Backgrounds';
import FloatingStarBadge from './components/FloatingStarBadge';
import Footer from './components/Footer';

// Pages
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import CollectionsPage from './components/CollectionsPage';
import CheckoutPage from './components/CheckoutPage';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import LoginScreen from './components/LoginScreen';

const AppContent: React.FC = () => {
    const { isNightMode } = useTheme();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [starsFound, setStarsFound] = useState(0);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    const loadData = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const addToCart = (product: Product, size: string, color: string) => {
        const newItem: CartItem = {
            ...product,
            cartId: Math.random().toString(36).substr(2, 9),
            selectedSize: size,
            selectedColor: color
        };
        setCart([...cart, newItem]);
        addToast(`Adicionado: ${product.name}`);
        setIsCartOpen(true);
    };

    const removeFromCart = (cartId: string) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const clearCart = () => {
        if (window.confirm("Tem certeza que deseja limpar a sacola?")) {
            setCart([]);
            addToast("Sacola limpa!", 'info');
        }
    };

    const toggleWishlist = (productId: string) => {
        if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId));
            addToast("Removido dos favoritos", 'info');
        } else {
            setWishlist([...wishlist, productId]);
            addToast("Adicionado aos favoritos! ❤️", 'success');
        }
    };

    const handleStarFound = () => {
        setStarsFound(prev => prev + 1);
        addToast("Estrela encontrada! ⭐", 'info');
    };

    // Protected Route Wrapper
    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        if (!isAdminAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        return <>{children}</>;
    };

    return (
        <div className={`min-h-screen pb-20 relative transition-theme ${isNightMode ? 'bg-night' : 'bg-day'}`}>

            {isNightMode ? <NightSky /> : <TwilightAmbience />}

            <StarHunt totalStarsFound={starsFound} onStarFound={handleStarFound} />
            <FloatingStarBadge count={starsFound} />

            <NavbarWrapper
                cartCount={cart.length}
                wishlistCount={wishlist.length}
                toggleCart={() => setIsCartOpen(true)}
                isAdminAuthenticated={isAdminAuthenticated}
            />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onRemove={removeFromCart}
                clearCart={clearCart}
            />

            <main className="relative z-10 transition-all duration-500 ease-in-out pt-6">
                <Routes>
                    <Route path="/" element={<HomePage products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />

                    <Route path="/produto/:id" element={<ProductPage products={products} onAddToCart={addToCart} />} />

                    <Route path="/colecoes" element={<CollectionsPage products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} />} />
                    <Route path="/colecoes/:category" element={<CollectionsPage products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} />} />

                    <Route path="/favoritos" element={<CollectionsPage products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} viewMode="wishlist" />} />

                    <Route path="/mix-match" element={<MixMatchStudio products={products} onAddToCart={addToCart} />} />
                    <Route path="/estudio-magico" element={<GeminiTools />} />
                    <Route path="/stylist" element={<GeminiStylist products={products} />} />

                    <Route path="/carrinho" element={<CheckoutPage cart={cart} onRemove={removeFromCart} />} />

                    <Route path="/login" element={
                        <LoginScreen onLoginSuccess={(isAdmin) => {
                            if (isAdmin) {
                                setIsAdminAuthenticated(true);
                                navigate('/admin');
                                addToast("Bem-vindo, Admin!", "success");
                            } else {
                                navigate('/');
                                addToast("Login realizado com sucesso!", "success");
                            }
                        }} />
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminDashboard
                                onLogout={() => {
                                    setIsAdminAuthenticated(false);
                                    navigate('/');
                                }}
                                products={products}
                                onProductUpdate={loadData}
                            />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <Footer />

        </div>
    );
};

// Wrapper to inject theme context into Navbar props
const NavbarWrapper: React.FC<{ cartCount: number, wishlistCount: number, toggleCart: () => void, isAdminAuthenticated: boolean }> = (props) => {
    const { isNightMode, toggleTheme } = useTheme();
    return <Navbar {...props} isNightMode={isNightMode} toggleTheme={toggleTheme} />;
}

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;