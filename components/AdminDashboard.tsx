import React, { useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { Product } from '../types';
import { addProduct, deleteProduct } from '../services/firebaseService';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';

const AdminDashboard: React.FC<{ onLogout: () => void, products: Product[], onProductUpdate: () => void }> = ({ onLogout, products, onProductUpdate }) => {
    const { isNightMode } = useTheme();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'import'>('overview');

    // Product Management State
    const [searchTerm, setSearchTerm] = useState('');
    const [formProduct, setFormProduct] = useState<Partial<Product>>({ name: '', price: 0, category: 'top', brand: 'Kaine', image: '', description: 'Nova peça.', sizes: ['2', '4', '6'], colors: ['Padrão'], occasion: 'Dia a Dia' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir?')) { await deleteProduct(id); addToast('Removido.', 'info'); onProductUpdate(); }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                // Simplified resize for brevity in this specific response block
                setFormProduct({ ...formProduct, image: ev.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = async () => {
        await addProduct({ ...formProduct as Product });
        addToast('Adicionado!', 'success');
        onProductUpdate();
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h2 className={`text-3xl font-bold ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Painel Admin</h2>
                <button onClick={onLogout} className="text-red-500 font-bold">Sair</button>
            </div>
            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'overview' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Visão Geral</button>
                <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'products' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Produtos</button>
            </div>

            {activeTab === 'overview' && <div className="text-center py-20"><p>Visão Geral do Sistema</p></div>}

            {activeTab === 'products' && (
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className={`p-8 rounded-3xl border ${isNightMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
                        <h3 className={`font-bold mb-4 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Adicionar Produto</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Nome" className="w-full p-3 border rounded-xl" value={formProduct.name} onChange={e => setFormProduct({ ...formProduct, name: e.target.value })} />
                            <input type="number" placeholder="Preço" className="w-full p-3 border rounded-xl" value={formProduct.price} onChange={e => setFormProduct({ ...formProduct, price: parseFloat(e.target.value) })} />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed p-4 rounded-xl text-center cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                            >
                                {formProduct.image ? "Imagem Carregada" : "Upload Imagem"}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </div>
                            <button onClick={handleAddProduct} className="w-full py-3 bg-sky-500 text-white rounded-xl font-bold">Salvar</button>
                        </div>
                    </div>
                    <div className={`p-8 rounded-3xl border ${isNightMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
                        <h3 className={`font-bold mb-4 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Lista</h3>
                        {filteredProducts.map(p => (
                            <div key={p.id} className="flex justify-between items-center mb-2 p-2 border-b">
                                <span className={isNightMode ? 'text-white' : 'text-gray-800'}>{p.name}</span>
                                <button onClick={() => handleDelete(p.id)} aria-label={`Excluir ${p.name}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
