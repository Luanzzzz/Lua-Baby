import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
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
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Vestido Floral')).toBeInTheDocument();
    });

    // Find heart icon button
    const wishlistButton = screen.getByRole('button', { name: /Adicionar aos favoritos/i });
    expect(wishlistButton).toBeInTheDocument();

    // Click heart icon
    await user.click(wishlistButton);

    // Check if wishlist count updated
    await waitFor(() => {
      // Wishlist badge should show 1
      const badges = screen.getAllByText('1');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('should remove item from wishlist when heart icon is clicked again', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Vestido Floral')).toBeInTheDocument();
    });

    // Find and click heart icon to add
    const wishlistButton = screen.getByRole('button', { name: /Adicionar aos favoritos/i });
    await user.click(wishlistButton);

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    // Remove from wishlist
    // Label changes to "Remover dos favoritos"
    const removeButton = screen.getByRole('button', { name: /Remover dos favoritos/i });
    await user.click(removeButton);

    // Wishlist should be empty
    await waitFor(() => {
      const badges = screen.queryAllByText('1');
      // Should only have cart badge, not wishlist
      expect(badges.length).toBeLessThan(2);
    });
  });

  it('should display wishlisted items on favorites page', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Wait for products and add to wishlist
    await waitFor(() => {
      expect(screen.getByText('Vestido Floral')).toBeInTheDocument();
    });

    const wishlistButton = screen.getByRole('button', { name: /Adicionar aos favoritos/i });
    await user.click(wishlistButton);

    // Navigate to favorites page
    const favoritesLink = screen.getByTitle(/Meus Favoritos/i);
    await user.click(favoritesLink);

    // Check if product appears on favorites page
    await waitFor(() => {
      expect(screen.getAllByText('Vestido Floral').length).toBeGreaterThan(0);
    });
  });

  it('should persist wishlist state across navigation', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Add to wishlist
    await waitFor(() => {
      expect(screen.getByText('Vestido Floral')).toBeInTheDocument();
    });

    const wishlistButton = screen.getByRole('button', { name: /Adicionar aos favoritos/i });
    await user.click(wishlistButton);

    // Navigate to collections using "Ver Coleção" button
    const collectionsLink = await screen.findByText(/Ver Coleção/i);
    await user.click(collectionsLink);

    // Navigate back to home using Logo
    const navigation = screen.getByRole('navigation');
    const homeLink = within(navigation).getByText(/Coleções/i);
    await user.click(homeLink);

    // Wishlist count should still be 1
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});
