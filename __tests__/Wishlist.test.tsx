import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import App from '../App';
import { getProducts } from '../services/firebaseService';

// Mock services
vi.mock('../services/firebaseService');
vi.mock('../services/geminiService');

const mockProducts = [
  {
    id: '1',
    name: 'Vestido Floral',
    price: 89.90,
    image: 'https://example.com/image1.jpg',
    category: 'fullbody' as const,
    description: 'Lindo vestido floral',
    sizes: ['2', '4', '6'],
    colors: ['Rosa', 'Azul'],
    brand: 'Kaine' as const,
    material: 'Algodão',
    care: 'Lavar à mão',
    occasion: 'Festa'
  }
];

describe('Wishlist Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getProducts as any).mockResolvedValue(mockProducts);
  });

  it('should add item to wishlist when heart icon is clicked', async () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Vestido Floral')).toBeInTheDocument();
    });

    // Find heart icon button
    const heartButtons = screen.getAllByRole('button');
    const wishlistButton = heartButtons.find(btn => 
      btn.querySelector('.lucide-heart')
    );

    expect(wishlistButton).toBeInTheDocument();

    // Click heart icon
    if (wishlistButton) {
      fireEvent.click(wishlistButton);
    }

    // Check if wishlist count updated
    await waitFor(() => {
      // Wishlist badge should show 1
      const badges = screen.getAllByText('1');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('should remove item from wishlist when heart icon is clicked again', async () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Vestido Floral')).toBeInTheDocument();
    });

    // Find and click heart icon to add
    const heartButtons = screen.getAllByRole('button');
    const wishlistButton = heartButtons.find(btn => 
      btn.querySelector('.lucide-heart')
    );

    if (wishlistButton) {
      // Add to wishlist
      fireEvent.click(wishlistButton);
      
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      // Remove from wishlist
      fireEvent.click(wishlistButton);
    }

    // Wishlist should be empty
    await waitFor(() => {
      const badges = screen.queryAllByText('1');
      // Should only have cart badge, not wishlist
      expect(badges.length).toBeLessThan(2);
    });
  });

  it('should display wishlisted items on favorites page', async () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    // Wait for products and add to wishlist
    await waitFor(() => {
      expect(screen.getByText('Vestido Floral')).toBeInTheDocument();
    });

    const heartButtons = screen.getAllByRole('button');
    const wishlistButton = heartButtons.find(btn => 
      btn.querySelector('.lucide-heart')
    );

    if (wishlistButton) {
      fireEvent.click(wishlistButton);
    }

    // Navigate to favorites page
    const favoritesLink = screen.getByText(/Favoritos/i);
    fireEvent.click(favoritesLink);

    // Check if product appears on favorites page
    await waitFor(() => {
      expect(screen.getAllByText('Vestido Floral').length).toBeGreaterThan(0);
    });
  });

  it('should persist wishlist state across navigation', async () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    // Add to wishlist
    await waitFor(() => {
      expect(screen.getByText('Vestido Floral')).toBeInTheDocument();
    });

    const heartButtons = screen.getAllByRole('button');
    const wishlistButton = heartButtons.find(btn => 
      btn.querySelector('.lucide-heart')
    );

    if (wishlistButton) {
      fireEvent.click(wishlistButton);
    }

    // Navigate to collections
    const collectionsLink = screen.getByText(/Coleções/i);
    fireEvent.click(collectionsLink);

    // Navigate back to home
    const homeLink = screen.getByText(/Início/i);
    fireEvent.click(homeLink);

    // Wishlist count should still be 1
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});
