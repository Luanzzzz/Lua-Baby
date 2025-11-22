import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, ShoppingBag, ArrowRight } from 'lucide-react';
import { generateTextContent } from '../services/geminiService';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    relatedProduct?: Product;
}

interface GeminiStylistProps {
    products: Product[];
}

const GeminiStylist: React.FC<GeminiStylistProps> = ({ products }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Olá! Sou sua assistente de moda da Lua Baby. 🌙✨ Estou aqui para ajudar você a encontrar o look perfeito. Me diga, qual é a ocasião?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Construct system prompt with product context
            const productContext = JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, occasion: p.occasion })));
            const systemPrompt = `
                Você é uma assistente de moda virtual da loja infantil Lua Baby.
                Seu tom é amigável, divertido e prestativo.
                
                Aqui está a lista de produtos disponíveis em estoque (JSON):
                ${productContext}

                O usuário disse: "${input}"

                Sua tarefa:
                1. Recomendar produtos específicos da lista acima que combinem com o pedido do usuário.
                2. Explicar por que escolheu esses produtos.
                3. Se não houver nada exato, sugira algo próximo ou peça mais detalhes.
                4. Mencione o nome exato do produto para que eu possa criar um link para ele.
                
                Responda em português. Seja concisa e encantadora.
            `;

            const responseText = await generateTextContent(systemPrompt);

            // Simple logic to find if a product was mentioned to show a card
            // In a real app, we might ask the LLM to return JSON with product IDs.
            // Here we'll just look for the first matching product name in the response.
            const mentionedProduct = products.find(p => responseText.includes(p.name));

            const aiMessage: Message = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'ai',
                relatedProduct: mentionedProduct
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error generating fashion advice:", error);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Desculpe, minhas antenas estelares estão com interferência. Tente novamente! 🛸", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in h-[calc(100vh-100px)] flex flex-col">
            <div className="text-center mb-6">
                <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-3 shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h2 className="text-3xl font-display font-bold text-indigo-950 dark:text-white">Gemini Stylist</h2>
                <p className="text-gray-500 dark:text-gray-400">Sua consultora de moda pessoal com Inteligência Artificial</p>
            </div>

            <div className="flex-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-[2rem] border border-white/60 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-5 ${msg.sender === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-md border border-gray-100 dark:border-gray-700'
                                }`}>
                                <div className="flex items-center gap-2 mb-2 opacity-70 text-xs font-bold uppercase tracking-wider">
                                    {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                                    {msg.sender === 'user' ? 'Você' : 'Gemini Stylist'}
                                </div>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                                {msg.relatedProduct && (
                                    <div
                                        onClick={() => navigate(`/produto/${msg.relatedProduct!.id}`)}
                                        className="mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 flex items-center gap-4 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border border-gray-200 dark:border-gray-700 group"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/produto/${msg.relatedProduct!.id}`); }}
                                    >
                                        <img src={msg.relatedProduct.image} alt={msg.relatedProduct.name} className="w-16 h-16 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-indigo-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{msg.relatedProduct.name}</p>
                                            <p className="text-xs text-gray-500">R$ {msg.relatedProduct.price.toFixed(2)}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-md flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
                                <span className="text-sm text-gray-500">Pensando no look ideal...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ex: Preciso de uma roupa para um casamento de dia..."
                            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            aria-label="Digite sua mensagem para a assistente de moda"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeminiStylist;
