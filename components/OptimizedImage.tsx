import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    fallbackSrc = 'https://via.placeholder.com/500?text=No+Image',
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const { isNightMode } = useTheme();

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Skeleton Loader */}
            {isLoading && (
                <div className={`absolute inset-0 animate-pulse z-10 ${isNightMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            )}

            {/* Error State */}
            {hasError ? (
                <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 ${isNightMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                    <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-medium">Imagem indisponível</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    {...props}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
