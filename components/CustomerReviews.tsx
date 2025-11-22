import React, { useState } from 'react';
import { Star, Send, User } from 'lucide-react';

interface Review {
    id: number;
    authorName: string;
    rating: number;
    comment: string;
    date: string;
    imageUrl?: string;
}

const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        authorName: "Mariana Silva",
        rating: 5,
        comment: "Amei a qualidade! O tecido é super macio e minha filha adorou.",
        date: "Há 2 dias",
        imageUrl: "https://images.unsplash.com/photo-1519238263496-6361932a4ad4?auto=format&fit=crop&w=150&q=80"
    },
    {
        id: 2,
        authorName: "Carlos Oliveira",
        rating: 4,
        comment: "Chegou rápido e bem embalado. O tamanho ficou perfeito.",
        date: "Há 1 semana",
        imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=150&q=80"
    },
    {
        id: 3,
        authorName: "Ana Souza",
        rating: 5,
        comment: "Simplesmente lindo! As cores são vibrantes como na foto.",
        date: "Há 2 semanas"
    }
];

const CustomerReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);

    const averageRating = (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const newReview: Review = {
            id: Date.now(),
            authorName: "Você",
            rating: newRating,
            comment: newComment,
            date: "Agora mesmo"
        };

        setReviews([newReview, ...reviews]);
        setNewComment('');
        setNewRating(5);
    };

    return (
        <section className="mt-20">
            <h2 className="text-3xl font-display font-bold mb-8 text-indigo-950 dark:text-white">Avaliações dos Clientes</h2>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Summary & Form */}
                <div className="lg:w-1/3 space-y-8">
                    <div className="glass-card p-8 rounded-[2rem] border border-white/60 dark:border-gray-700 dark:bg-gray-800/50 text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-2">Média de Avaliações</p>
                        <div className="text-6xl font-bold text-indigo-950 dark:text-white mb-4">{averageRating}</div>
                        <div className="flex justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-6 h-6 ${star <= Number(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <p className="text-sm text-gray-400">{reviews.length} avaliações</p>
                    </div>

                    <form onSubmit={handleSubmit} className="glass-card p-8 rounded-[2rem] border border-white/60 dark:border-gray-700 dark:bg-gray-800/50">
                        <h3 className="font-bold text-lg mb-4 dark:text-white">Deixe sua avaliação</h3>

                        <div className="flex gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star className={`w-8 h-8 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="O que você achou do produto?"
                            className="w-full p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 mb-4 focus:ring-2 focus:ring-sky-500 outline-none resize-none h-32"
                        />

                        <button
                            type="submit"
                            className="w-full py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" /> Enviar Avaliação
                        </button>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="lg:w-2/3 space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="glass-card p-6 rounded-3xl border border-white/60 dark:border-gray-700 dark:bg-gray-800/50 flex gap-6 animate-fade-in">
                            <div className="shrink-0">
                                {review.imageUrl ? (
                                    <img src={review.imageUrl} alt={review.authorName} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center border-2 border-white/50">
                                        <User className="w-8 h-8 text-indigo-400 dark:text-indigo-300" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg dark:text-white">{review.authorName}</h4>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400">{review.date}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomerReviews;
