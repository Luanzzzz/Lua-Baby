import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import GeminiStylist from '../components/GeminiStylist';
import { generateTextContent } from '../services/geminiService';

// Mock the gemini service
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

describe('Gemini Service Mock Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should mock generateTextContent and not make real API calls', async () => {
    // Setup mock response
    (generateTextContent as any).mockResolvedValue(
      'Olá! Para uma festa, recomendo o Vestido Floral. É perfeito para ocasiões especiais!'
    );

    render(
      <HashRouter>
        <GeminiStylist products={mockProducts} />
      </HashRouter>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Preciso de uma roupa/i)).toBeInTheDocument();
    });

    // Type a message
    const input = screen.getByPlaceholderText(/Preciso de uma roupa/i);
    fireEvent.change(input, { target: { value: 'Preciso de uma roupa para festa' } });

    // Click send button
    const sendButton = screen.getByRole('button', { name: '' }); // Send button with icon
    fireEvent.click(sendButton);

    // Verify mock was called
    await waitFor(() => {
      expect(generateTextContent).toHaveBeenCalledTimes(1);
      expect(generateTextContent).toHaveBeenCalledWith(
        expect.stringContaining('Preciso de uma roupa para festa')
      );
    });

    // Verify response is displayed
    await waitFor(() => {
      expect(screen.getByText(/Vestido Floral/i)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock an error
    (generateTextContent as any).mockRejectedValue(new Error('API Error'));

    render(
      <HashRouter>
        <GeminiStylist products={mockProducts} />
      </HashRouter>
    );

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Preciso de uma roupa/i);
      fireEvent.change(input, { target: { value: 'Test message' } });
    });

    const sendButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sendButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/interferência|Tente novamente/i)).toBeInTheDocument();
    });
  });

  it('should not make API calls during tests', async () => {
    (generateTextContent as any).mockResolvedValue('Mocked response');

    render(
      <HashRouter>
        <GeminiStylist products={mockProducts} />
      </HashRouter>
    );

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Preciso de uma roupa/i);
      fireEvent.change(input, { target: { value: 'Test' } });
    });

    const sendButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sendButton);

    // Verify the mock was used, not real API
    await waitFor(() => {
      expect(generateTextContent).toHaveBeenCalled();
      // If this passes, we know we're using the mock, not making real API calls
    });
  });

  it('should display product cards when AI mentions products', async () => {
    // Mock response that mentions a product
    (generateTextContent as any).mockResolvedValue(
      'Recomendo o Vestido Floral para você!'
    );

    render(
      <HashRouter>
        <GeminiStylist products={mockProducts} />
      </HashRouter>
    );

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Preciso de uma roupa/i);
      fireEvent.change(input, { target: { value: 'O que você recomenda?' } });
    });

    const sendButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sendButton);

    // Should show product card
    await waitFor(() => {
      expect(screen.getByText(/Vestido Floral/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 89\.90/)).toBeInTheDocument();
    });
  });
});
