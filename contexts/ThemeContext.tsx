import React, { createContext, useState, useContext } from 'react';

interface ThemeContextType {
    isNightMode: boolean;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    isNightMode: false,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isNightMode, setIsNightMode] = useState(false);

    const toggleTheme = () => {
        setIsNightMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isNightMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
