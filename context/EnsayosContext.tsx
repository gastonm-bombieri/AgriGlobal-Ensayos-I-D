
import React, { createContext, useContext, ReactNode } from 'react';
import { useEnsayos as useEnsayosHook } from '../hooks/useEnsayos';

type EnsayosHookReturnType = ReturnType<typeof useEnsayosHook>;

const EnsayosContext = createContext<EnsayosHookReturnType | null>(null);

export const EnsayosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ensayosData = useEnsayosHook();
  return (
    <EnsayosContext.Provider value={ensayosData}>
      {children}
    </EnsayosContext.Provider>
  );
};

export const useEnsayos = (): EnsayosHookReturnType => {
  const context = useContext(EnsayosContext);
  if (!context) {
    throw new Error('useEnsayos must be used within an EnsayosProvider');
  }
  return context;
};
