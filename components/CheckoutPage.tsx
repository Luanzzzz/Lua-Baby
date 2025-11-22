import React from 'react';
import { Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import SEO from './SEO';

const CheckoutPage: React.FC = () => {
    const { isNightMode } = useTheme();
    const { cart, removeFromCart, cartTotal } = useCart();

    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        cep: '',
        street: '',
        number: '',
        district: ''
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlurCep = async () => {
        const cep = formData.cep.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro,
                        district: data.bairro
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefone é obrigatório';
        } else if (formData.phone.replace(/\D/g, '').length < 11) {
            newErrors.phone = 'Telefone inválido (mínimo 11 dígitos)';
        }
        if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
        if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
        if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
        if (!formData.district.trim()) newErrors.district = 'Bairro é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFinalizePurchase = () => {
        if (!validateForm()) return;

        const message = `*Novo Pedido - Lua Baby*\n\n` +
            `*Cliente:* ${formData.name}\n` +
            `*Telefone:* ${formData.phone}\n\n` +
            `*Itens:*\n` +
            cart.map(item => `- ${item.name} (${item.selectedSize}, ${item.selectedColor}): R$ ${item.price.toFixed(2)}`).join('\n') +
            `\n\n*Total:* R$ ${cartTotal.toFixed(2)}\n\n` +
            `*Endereço de Entrega:*\n` +
            `${formData.street}, ${formData.number} - ${formData.district}\n` +
            `CEP: ${formData.cep}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/5511999999999?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in min-h-screen">
            <SEO title="Carrinho" description="Finalize sua compra." />
            <h1 className={`text-4xl font-display font-bold mb-8 ${isNightMode ? 'text-white' : 'text-indigo-950'}`}>Seu Carrinho</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3 space-y-4">
                    {cart.length === 0 ? (
                        <div className={`p-12 rounded-3xl text-center border ${isNightMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <p className="text-gray-500 text-lg">Sua sacola está vazia.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.cartId} className={`flex gap-6 p-6 rounded-3xl border ${isNightMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                                <img src={item.image} className="w-24 h-24 rounded-xl object-cover" alt={item.name} />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className={`font-bold text-lg ${isNightMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                                        <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                    <p className="text-sm text-gray-500">{item.brand} • {item.selectedSize} • {item.selectedColor}</p>
                                    <p className="text-hotpink-500 font-bold text-xl mt-2">R$ {item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="lg:w-1/3">
                        <div className={`p-8 rounded-[2rem] sticky top-24 border ${isNightMode ? 'bg-gray-900 border-gray-700' : 'glass-premium border-white'}`}>
                            <h3 className={`text-xl font-bold mb-6 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Dados de Entrega</h3>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>Nome Completo</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-xl border ${errors.name ? 'border-red-500' : isNightMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                                        placeholder="Seu nome"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>Telefone (WhatsApp)</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-xl border ${errors.phone ? 'border-red-500' : isNightMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                                        placeholder="(11) 99999-9999"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/3">
                                        <label className={`block text-sm font-medium mb-1 ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>CEP</label>
                                        <input
                                            type="text"
                                            name="cep"
                                            value={formData.cep}
                                            onChange={handleInputChange}
                                            onBlur={handleBlurCep}
                                            className={`w-full px-4 py-2 rounded-xl border ${errors.cep ? 'border-red-500' : isNightMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                                            placeholder="00000-000"
                                        />
                                        {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <label className={`block text-sm font-medium mb-1 ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>Rua</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-xl border ${errors.street ? 'border-red-500' : isNightMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                                            placeholder="Nome da rua"
                                        />
                                        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/3">
                                        <label className={`block text-sm font-medium mb-1 ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>Número</label>
                                        <input
                                            type="text"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-xl border ${errors.number ? 'border-red-500' : isNightMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                                            placeholder="123"
                                        />
                                        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <label className={`block text-sm font-medium mb-1 ${isNightMode ? 'text-gray-300' : 'text-gray-700'}`}>Bairro</label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-xl border ${errors.district ? 'border-red-500' : isNightMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                                            placeholder="Bairro"
                                        />
                                        {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                                    </div>
                                </div>
                            </div>

                            <h3 className={`text-xl font-bold mb-6 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Resumo do Pedido</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>R$ {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-green-500 font-bold">
                                    <span>Frete</span>
                                    <span>Grátis</span>
                                </div>
                                <div className={`flex justify-between text-2xl font-bold pt-4 border-t border-dashed ${isNightMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-300'}`}>
                                    <span>Total</span>
                                    <span>R$ {cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleFinalizePurchase}
                                className="w-full py-4 bg-green-500 text-white rounded-xl font-bold shadow-lg hover:bg-green-600 transition-colors"
                            >
                                Finalizar Compra
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
