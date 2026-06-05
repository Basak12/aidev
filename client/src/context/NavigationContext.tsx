import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const routerNavigate = useNavigate();

  return (
    <NavigationContext.Provider value={{ currentPath: pathname, navigate: routerNavigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used inside NavigationProvider');
  return ctx;
}
