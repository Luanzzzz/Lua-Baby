import React, { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

export interface Toast {
    id: number;
    msg: string;
    type: 'success' | 'info';
}

interface ToastContextType {
    addToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ToastContext = createContext<ToastContextType>({
    addToast: () => { },
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((msg: string, type: 'success' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            <div className="fixed top-24 right-6 z-[200] space-y-3">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl transform transition-all animate-slide-up cursor-pointer hover:scale-102 ${toast.type === 'success' ? 'bg-white border-l-4 border-green-500 text-gray-800' : 'bg-white border-l-4 border-sky-500 text-gray-800'
                            }`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <Sparkles className="text-sky-500 w-6 h-6" />}
                        <span className="font-bold">{toast.msg}</span>
                    </div>
                ))}
            </div>
            {children}
        </ToastContext.Provider>
    );
};
