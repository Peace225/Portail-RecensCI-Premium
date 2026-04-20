// src/context/SecurityContext.tsx
import React, { createContext, useContext, useState } from 'react';

const SecurityContext = createContext({
  mode: 'CIVIL',
  toggleMode: () => {},
});

export const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'CIVIL' | 'EMERGENCY'>('CIVIL');
  const toggleMode = () => setMode(m => m === 'CIVIL' ? 'EMERGENCY' : 'CIVIL');

  return (
    <SecurityContext.Provider value={{ mode, toggleMode }}>
      <div className={mode === 'EMERGENCY' ? 'theme-emergency' : 'theme-civil'}>
        {children}
      </div>
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);