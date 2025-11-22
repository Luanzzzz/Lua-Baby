import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import GeminiStylist from '../components/GeminiStylist';
import { generateTextContent } from '../services/geminiService';
import { CartProvider } from '../contexts/CartContext';
import { ToastProvider } from '../contexts/ToastContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock the gemini service
vi.mock('../services/geminiService');

// Mock CartContext module
vi.mock('../contexts/CartContext', () => {
  const React = require('react');
  return {
    useCart: () => ({
      addToCart: vi.fn(),
      cart: [],
      isCartOpen: false
    }),
    CartProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children)
  };
});

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

describe('Gemini Service Mock Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('should mock generateTextContent and not make real API calls', async () => {
    const user = userEvent.setup();
    (generateTextContent as any).mockResolvedValue(
      'Olá! Para uma festa, recomendo o Vestido Floral.'
    );

    render(
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <MemoryRouter>
              <GeminiStylist products={mockProducts} />
            </MemoryRouter>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Preciso de uma roupa/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Preciso de uma roupa/i);
    await user.type(input, 'Preciso de uma roupa para festa');

    const sendButton = screen.getByRole('button', { name: /Enviar mensagem/i });
    await user.click(sendButton);

    await waitFor(() => {
      expect(generateTextContent).toHaveBeenCalledTimes(1);
    });
  });
});
