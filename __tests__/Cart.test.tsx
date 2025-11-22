import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartDrawer from '../components/CartDrawer';
import { CartItem } from '../types';

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

describe('CartDrawer Component', () => {
  const mockOnClose = vi.fn();
  const mockOnRemove = vi.fn();
  const mockClearCart = vi.fn();

  const mockCartItems: CartItem[] = [
    {
      id: '1',
      cartId: 'cart-1',
      name: 'Produto 1',
      price: 50.0,
      image: 'img1.jpg',
      category: 'top',
      brand: 'Brand A',
      description: 'Desc 1',
      sizes: ['P'],
      colors: ['Red'],
      occasion: 'Casual',
      selectedSize: 'P',
      selectedColor: 'Red',
    },
    {
      id: '2',
      cartId: 'cart-2',
      name: 'Produto 2',
      price: 30.0,
      image: 'img2.jpg',
      category: 'bottom',
      brand: 'Brand B',
      description: 'Desc 2',
      sizes: ['M'],
      colors: ['Blue'],
      occasion: 'Casual',
      selectedSize: 'M',
      selectedColor: 'Blue',
    },
  ];

  it('should not render when isOpen is false', () => {
    render(
      <CartDrawer
        isOpen={false}
        onClose={mockOnClose}
        cart={[]}
        onRemove={mockOnRemove}
        clearCart={mockClearCart}
      />
    );
    expect(screen.queryByText('Sacola')).not.toBeInTheDocument();
  });

  it('should render empty state correctly', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={[]}
        onRemove={mockOnRemove}
        clearCart={mockClearCart}
      />
    );
    expect(screen.getByText('Sacola (0)')).toBeInTheDocument();
    expect(screen.getByText('Sua sacola está vazia.')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('R$ 0.00')).toBeInTheDocument();
  });

  it('should display items and calculate total price correctly', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={mockCartItems}
        onRemove={mockOnRemove}
        clearCart={mockClearCart}
      />
    );

    expect(screen.getByText('Sacola (2)')).toBeInTheDocument();
    expect(screen.getByText('Produto 1')).toBeInTheDocument();
    expect(screen.getByText('Produto 2')).toBeInTheDocument();

    // Check total: 50 + 30 = 80
    expect(screen.getByText('R$ 80.00')).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={mockCartItems}
        onRemove={mockOnRemove}
        clearCart={mockClearCart}
      />
    );

    const removeButtons = screen.getAllByLabelText(/Remover/);
    fireEvent.click(removeButtons[0]);
    expect(mockOnRemove).toHaveBeenCalledWith('cart-1');
  });

  it('should call clearCart when clear button is clicked', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={mockCartItems}
        onRemove={mockOnRemove}
        clearCart={mockClearCart}
      />
    );

    const clearButton = screen.getByText('Limpar Sacola');
    fireEvent.click(clearButton);
    expect(mockClearCart).toHaveBeenCalled();
  });

  it('should display "Finalizar pelo WhatsApp" button when items exist', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={mockCartItems}
        onRemove={mockOnRemove}
        clearCart={mockClearCart}
      />
    );

    const checkoutButton = screen.getByText('Finalizar pelo WhatsApp');
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton).not.toBeDisabled();
  });

  it('should disable action buttons when cart is empty', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={[]}
        onRemove={mockOnRemove}
        clearCart={mockClearCart}
      />
    );

    const checkoutButton = screen.getByText('Finalizar pelo WhatsApp');
    const clearButton = screen.getByText('Limpar Sacola');

    expect(checkoutButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
});
