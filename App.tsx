import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import StarHunt from './components/StarHunt';
// Lazy load components
const MixMatchStudio = lazy(() => import('./components/MixMatchStudio'));
const GeminiTools = lazy(() => import('./components/GeminiTools'));
const GeminiStylist = lazy(() => import('./components/GeminiStylist'));

import { Product } from './types';
import { getProducts } from './services/firebaseService';

// Contexts
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';

// Components
import { NightSky, TwilightAmbience } from './components/Backgrounds';
import FloatingStarBadge from './components/FloatingStarBadge';
import Footer from './components/Footer';

// Pages - Lazy loaded
const HomePage = lazy(() => import('./components/HomePage'));
const ProductPage = lazy(() => import('./components/ProductPage'));
const CollectionsPage = lazy(() => import('./components/CollectionsPage'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const LoginScreen = lazy(() => import('./components/LoginScreen'));

// Loading Fallback
const PageLoader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hotpink-500"></div>
    </div>
);

// Wrapper to inject theme context into Navbar props
const NavbarWrapper: React.FC<{ wishlistCount: number, isAdminAuthenticated: boolean }> = (props) => {
    const { isNightMode, toggleTheme } = useTheme();
    return <Navbar {...props} isNightMode={isNightMode} toggleTheme={toggleTheme} />;
}

const AppContent: React.FC = () => {
    const { isNightMode } = useTheme();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
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
                wishlistCount={wishlist.length}
                isAdminAuthenticated={isAdminAuthenticated}
            />

            <Suspense fallback={null}>
                <CartDrawer />
            </Suspense>

            <main className="relative z-10 transition-all duration-500 ease-in-out pt-6">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<HomePage products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />

                        <Route path="/produto/:id" element={<ProductPage products={products} />} />

                        <Route path="/colecoes" element={<CollectionsPage products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} />} />
                        <Route path="/colecoes/:category" element={<CollectionsPage products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} />} />

                        <Route path="/favoritos" element={<CollectionsPage products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} viewMode="wishlist" />} />

                        <Route path="/montar-look" element={<MixMatchStudio products={products} />} />
                        <Route path="/estudio-magico" element={<GeminiTools />} />
                        <Route path="/stylist" element={<GeminiStylist products={products} />} />

                        <Route path="/carrinho" element={<CheckoutPage />} />

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
                </Suspense>
            </main>

            <Footer />

        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;