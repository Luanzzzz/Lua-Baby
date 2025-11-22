import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

describe('Routing Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getProducts as any).mockResolvedValue(mockProducts);
  });

  it('should navigate to Coleções page when CTA button is clicked', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Wait for app to load
    await waitFor(() => {
      expect(screen.getByText(/Estilo que brilha/i)).toBeInTheDocument();
    });

    // Find and click "Ver Coleção" button in Hero
    const ctaButton = screen.getByText(/Ver Coleção/i);
    expect(ctaButton).toBeInTheDocument();

    fireEvent.click(ctaButton);

    // Verify we're on the collections page
    await waitFor(() => {
      // Should see collection-specific content
      expect(screen.getByText(/Todas as Coleções|Coleção/i)).toBeInTheDocument();
    });
  });

  it('should navigate to product detail page', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Vestido Floral')).toBeInTheDocument();
    });

    // Click on product
    const productCard = screen.getByText('Vestido Floral');
    fireEvent.click(productCard);

    // Should see product detail page with "Adicionar à Sacola" button
    await waitFor(() => {
      expect(screen.getByText(/Adicionar à Sacola/i)).toBeInTheDocument();
      expect(screen.getByText('Lindo vestido floral')).toBeInTheDocument();
    });
  });

  it('should navigate to favorites page', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTitle(/Meus Favoritos/i)).toBeInTheDocument();
    });

    const favoritesLink = screen.getByTitle(/Meus Favoritos/i);
    fireEvent.click(favoritesLink);

    await waitFor(() => {
      expect(screen.getByText(/Favoritos/i)).toBeInTheDocument();
    });
  });

  it('should navigate to Mix & Match page', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      const mixMatchLink = screen.getByText(/Montar Look/i);
      expect(mixMatchLink).toBeInTheDocument();
      fireEvent.click(mixMatchLink);
    });

    // Verify navigation occurred
    await waitFor(() => {
      // Mix & Match page should have specific content
      expect(screen.getByText(/Estúdio de Looks/i)).toBeInTheDocument();
    });
  });

  it('should navigate to Gemini Stylist page', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      const stylistLink = screen.getByText(/Estúdio Mágico/i);
      expect(stylistLink).toBeInTheDocument();
      fireEvent.click(stylistLink);
    });

    // Verify we're on stylist page
    await waitFor(() => {
      expect(screen.getByText(/Estúdio Mágico IA/i)).toBeInTheDocument();
    });
  });

  it('should navigate back to home from product page', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Navigate to product
    await waitFor(() => {
      const productCard = screen.getByText('Vestido Floral');
      fireEvent.click(productCard);
    });

    // Click back button
    await waitFor(() => {
      const backButton = screen.getByText(/Voltar/i);
      fireEvent.click(backButton);
    });

    // Should be back on home page
    await waitFor(() => {
      expect(screen.getByText(/Os Queridinhos/i)).toBeInTheDocument();
    });
  });

  it('should redirect unknown routes to home', async () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );

    // Should redirect to home
    await waitFor(() => {
      expect(screen.getByText(/Estilo que brilha/i)).toBeInTheDocument();
    });
  });
});
