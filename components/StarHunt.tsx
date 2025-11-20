import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface StarHuntProps {
  onStarFound: () => void;
  totalStarsFound: number;
}

const StarHunt: React.FC<StarHuntProps> = ({ onStarFound, totalStarsFound }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ top: '0%', left: '0%' });

  useEffect(() => {
    // Randomize position on mount
    const top = Math.floor(Math.random() * 80) + 10; // 10% to 90%
    const left = Math.floor(Math.random() * 90) + 5; // 5% to 95%
    setPosition({ top: `${top}%`, left: `${left}%` });
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    onStarFound();
  };

  if (!isVisible || totalStarsFound >= 3) return null;

  return (
    <div 
      onClick={handleClick}
      className="absolute cursor-pointer z-50 animate-pulse hover:scale-125 transition-transform duration-300"
      style={{ top: position.top, left: position.left }}
    >
      <Star className="w-8 h-8 text-moon-400 fill-moon-300 drop-shadow-lg" />
    </div>
  );
};

export default StarHunt;