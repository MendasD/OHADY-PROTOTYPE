import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { navModules } from '../nav/navConfig';

interface SidebarContextValue {
  activeModule: string;
  setActiveModule: (id: string) => void;
  panelOpen: boolean;
  setPanelOpen: (v: boolean) => void;
  barVisible: boolean;
  setBarVisible: (v: boolean) => void;
  iaOpen: boolean;
  setIaOpen: (v: boolean) => void;
  toggleModule: (id: string) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function findModuleForPath(pathname: string): string | null {
  for (const mod of navModules) {
    for (const child of mod.children) {
      if (pathname === child.path || pathname.startsWith(child.path + '/')) {
        return mod.id;
      }
    }
  }
  return null;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const initialModule = findModuleForPath(location.pathname) ?? 'pilotage';
  const [activeModule, setActiveModule] = useState(initialModule);
  const [panelOpen, setPanelOpen] = useState(true);
  const [barVisible, setBarVisible] = useState(true);
  const [iaOpen, setIaOpen] = useState(false);

  // Sync activeModule with URL on each route change
  useEffect(() => {
    const moduleId = findModuleForPath(location.pathname);
    if (moduleId && moduleId !== activeModule) {
      setActiveModule(moduleId);
    }
  }, [location.pathname, activeModule]);

  const toggleModule = (id: string) => {
    if (activeModule === id) {
      setPanelOpen(prev => !prev);
    } else {
      setActiveModule(id);
      setPanelOpen(true);
    }
  };

  return (
    <SidebarContext.Provider value={{
      activeModule, setActiveModule,
      panelOpen, setPanelOpen,
      barVisible, setBarVisible,
      iaOpen, setIaOpen,
      toggleModule,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
