import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoginScreen: React.FC<{ onLoginSuccess: (isAdmin: boolean) => void }> = ({ onLoginSuccess }) => {
    const { isNightMode } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email === 'admin@luababy.com' && password === '252@Selu') {
            onLoginSuccess(true);
        } else {
            onLoginSuccess(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className={`p-10 rounded-[3rem] shadow-xl max-w-md w-full text-center ${isNightMode ? 'bg-gray-900 border border-gray-700' : 'glass-premium'}`}>
                <h2 className={`text-3xl font-bold mb-8 ${isNightMode ? 'text-white' : 'text-gray-900'}`}>Login</h2>
                <input type="text" placeholder="Email" className="w-full p-4 mb-4 rounded-xl border" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Senha" className="w-full p-4 mb-8 rounded-xl border" value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={handleLogin} className="w-full py-4 bg-sky-500 text-white rounded-xl font-bold">Entrar</button>
            </div>
        </div>
    );
};

export default LoginScreen;
