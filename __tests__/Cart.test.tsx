import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import CartDrawer from '../components/CartDrawer';
import { CartItem } from '../types';
import { useCart } from '../contexts/CartContext';

// Mock ThemeContext
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    isNightMode: false,
  }),
}));

// Mock Lucide icons to avoid issues during render
vi.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x">X</span>,
  Trash2: () => <span data-testid="icon-trash">Trash</span>,
  MessageCircle: () => <span data-testid="icon-message">Message</span>,
}));

// Mock useCart
vi.mock('../contexts/CartContext', () => ({
  useCart: vi.fn(),
}));

describe('CartDrawer Component', () => {
  const mockCloseCart = vi.fn();
  const mockRemoveFromCart = vi.fn();
  const mockClearCart = vi.fn();

  const item1: CartItem = {
    id: '1',
    cartId: 'abc-123',
    name: 'Camiseta Estelar',
    price: 49.90,
    image: 'img1.jpg',
    category: 'top',
    brand: 'Kaine',
    description: 'Uma camiseta legal',
    sizes: ['2', '4'],
    colors: ['Azul'],
    occasion: 'Dia a dia',
    selectedSize: '4',
    selectedColor: 'Azul',
    material: 'Algodão',
    care: 'Lavar à máquina'
  };

  const item2: CartItem = {
    id: '2',
    cartId: 'def-456',
    name: 'Calça Cometa',
    price: 89.90,
    image: 'img2.jpg',
    category: 'bottom',
    brand: 'Dingdang',
    description: 'Uma calça legal',
    sizes: ['2', '4'],
    colors: ['Preto'],
    occasion: 'Dia a dia',
    selectedSize: '2',
    selectedColor: 'Preto',
    material: 'Jeans',
    care: 'Lavar à máquina'
  };

  const mockCartItems: CartItem[] = [item1, item2];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isCartOpen is false', () => {
    (useCart as Mock).mockReturnValue({
      isCartOpen: false,
      cart: [],
      closeCart: mockCloseCart,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      cartTotal: 0,
    });

    render(<CartDrawer />);
    expect(screen.queryByText('Sacola')).not.toBeInTheDocument();
  });

  it('should render empty state correctly', () => {
    (useCart as Mock).mockReturnValue({
      isCartOpen: true,
      cart: [],
      closeCart: mockCloseCart,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      cartTotal: 0,
    });

    render(<CartDrawer />);
    expect(screen.getByText('Sacola (0)')).toBeInTheDocument();
    expect(screen.getByText('Sua sacola está vazia.')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('R$ 0.00')).toBeInTheDocument();
  });

  it('should display items and calculate total price correctly', () => {
    (useCart as Mock).mockReturnValue({
      isCartOpen: true,
      cart: mockCartItems,
      closeCart: mockCloseCart,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      cartTotal: 80.0,
    });

    render(<CartDrawer />);

    expect(screen.getByText('Sacola (2)')).toBeInTheDocument();
    expect(screen.getByText('Camiseta Estelar')).toBeInTheDocument();
    expect(screen.getByText('Calça Cometa')).toBeInTheDocument();

    // Check total: 50 + 30 = 80
    expect(screen.getByText('R$ 80.00')).toBeInTheDocument();
  });

  it('should call removeFromCart when remove button is clicked', () => {
    (useCart as Mock).mockReturnValue({
      isCartOpen: true,
      cart: mockCartItems,
      closeCart: mockCloseCart,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      cartTotal: 80.0,
    });

    render(<CartDrawer />);

    const removeButtons = screen.getAllByRole('button', { name: /Remover/i });
    fireEvent.click(removeButtons[0]);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('abc-123');
  });

  it('should call clearCart when clear button is clicked', () => {
    (useCart as Mock).mockReturnValue({
      isCartOpen: true,
      cart: mockCartItems,
      closeCart: mockCloseCart,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      cartTotal: 80.0,
    });

    render(<CartDrawer />);

    const clearButton = screen.getByText('Limpar Sacola');
    fireEvent.click(clearButton);
    expect(mockClearCart).toHaveBeenCalled();
  });

  it('should display "Finalizar pelo WhatsApp" button when items exist', () => {
    (useCart as Mock).mockReturnValue({
      isCartOpen: true,
      cart: mockCartItems,
      closeCart: mockCloseCart,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      cartTotal: 80.0,
    });

    render(<CartDrawer />);

    const checkoutButton = screen.getByText('Finalizar pelo WhatsApp');
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton).not.toBeDisabled();
  });

  it('should disable action buttons when cart is empty', () => {
    (useCart as Mock).mockReturnValue({
      isCartOpen: true,
      cart: [],
      closeCart: mockCloseCart,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      cartTotal: 0,
    });

    render(<CartDrawer />);

    const checkoutButton = screen.getByText('Finalizar pelo WhatsApp');
    const clearButton = screen.getByText('Limpar Sacola');

    expect(checkoutButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
});
