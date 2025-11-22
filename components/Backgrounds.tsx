import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';

export const NightSky: React.FC = () => {
    const [stars, setStars] = useState<{ id: number, top: number, left: number, size: number, delay: number }[]>([]);

    useEffect(() => {
        const starCount = 50;
        const newStars = [];
        for (let i = 0; i < starCount; i++) {
            newStars.push({
                id: i,
                top: Math.random() * 100,
                left: Math.random() * 100,
                size: Math.random() * 3 + 1,
                delay: Math.random() * 3
            });
        }
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {stars.map(star => (
                <div
                    key={star.id}
                    className="star animate-twinkle"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        opacity: Math.random()
                    }}
                />
            ))}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 w-[600px] h-[600px]">
                <Moon className="w-full h-full text-yellow-300" />
            </div>
        </div>
    );
};

export const TwilightAmbience: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-orange-300 rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-pulse-slow"></div>
            <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-indigo-300 rounded-full blur-[120px] opacity-30 mix-blend-multiply flex items-center justify-center animate-pulse"></div>
        </div>
    );
};
