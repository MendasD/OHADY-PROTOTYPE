import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ActivityBar from './ActivityBar';
import SidebarPanel from './SidebarPanel';
import Header from './Header';
import IAFloatingPanel from '../ia/IAFloatingPanel';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import { PersonaProvider } from '../../context/PersonaContext';

function LayoutInner() {
  const { barVisible, panelOpen, setBarVisible, setPanelOpen } = useSidebar();

  // On mobile, sidebar overlays content (no left offset); on lg+, content shifts
  const desktopLeftOffset = barVisible ? (panelOpen ? 84 + 220 : 84) : 0;

  // Initialize once + auto-collapse uniquement quand on PASSE en mobile (sans écraser le choix utilisateur sur desktop)
  useEffect(() => {
    let wasMobile = window.innerWidth < 1024;
    // Init mobile state
    if (wasMobile) {
      setBarVisible(false);
      setPanelOpen(false);
    }
    const onResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile !== wasMobile) {
        // Seulement quand on franchit le breakpoint
        if (isMobile) {
          setBarVisible(false);
          setPanelOpen(false);
        } else {
          setBarVisible(true);
          setPanelOpen(true);
        }
        wasMobile = isMobile;
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMobileOverlay = barVisible;

  return (
    <div className="flex w-full min-h-screen bg-neutral-100">
      <ActivityBar />
      <SidebarPanel />

      {/* Mobile backdrop */}
      {isMobileOverlay && (
        <div
          onClick={() => { setBarVisible(false); setPanelOpen(false); }}
          className="lg:hidden fixed inset-0 z-20 bg-black/30 backdrop-blur-[2px]"
        />
      )}

      <div
        className="flex-1 flex flex-col min-h-screen lg:ml-[var(--side-offset)] ml-0"
        style={{
          ['--side-offset' as any]: `${desktopLeftOffset}px`,
          transition: 'margin-left 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Header />
        <main className="flex-1 overflow-auto px-3 sm:px-5 pb-3 sm:pb-5 pt-[68px] sm:pt-[76px]">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <IAFloatingPanel />
    </div>
  );
}

export default function Layout() {
  return (
    <PersonaProvider>
      <SidebarProvider>
        <LayoutInner />
      </SidebarProvider>
    </PersonaProvider>
  );
}
