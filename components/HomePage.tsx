import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import SEO from './SEO';
import Hero from './Hero';
import ProductCard from './ProductCard';

const HomePage: React.FC<{ products: Product[], wishlist: string[], toggleWishlist: (id: string) => void }> = ({ products, wishlist, toggleWishlist }) => {
    const { isNightMode } = useTheme();
    const navigate = useNavigate();

    return (
        <>
            <SEO title="Início" description="Lua Baby - Moda infantil premium, divertida e confortável." />
            <Hero onCtaClick={() => navigate('/colecoes')} />

            {/* Best Sellers Section */}
            <section className="container mx-auto px-6 mb-20">
                <h2 className={`text-3xl font-display font-bold mb-8 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Os Queridinhos</h2>
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                    {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="snap-start shrink-0 w-72 md:w-80">
                            <ProductCard
                                product={product}
                                isBestSeller={true}
                                isWishlisted={wishlist.includes(product.id)}
                                onToggleWishlist={toggleWishlist}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default HomePage;
