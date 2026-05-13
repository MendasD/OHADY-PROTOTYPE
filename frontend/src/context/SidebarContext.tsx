import { createContext, useContext, useState, type ReactNode } from 'react';

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

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModule] = useState('pilotage');
  const [panelOpen, setPanelOpen] = useState(true);
  const [barVisible, setBarVisible] = useState(true);
  const [iaOpen, setIaOpen] = useState(false);

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
