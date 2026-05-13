import { Outlet } from 'react-router-dom';
import ActivityBar from './ActivityBar';
import SidebarPanel from './SidebarPanel';
import Header from './Header';
import IAFloatingPanel from '../ia/IAFloatingPanel';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';

function LayoutInner() {
  const { barVisible, panelOpen } = useSidebar();

  const leftOffset = barVisible
    ? panelOpen ? 64 + 220 : 64
    : 0;

  return (
    <div className="flex w-full min-h-screen bg-neutral-100">
      <ActivityBar />
      <SidebarPanel />
      <div
        className="flex-1 flex flex-col min-h-screen"
        style={{
          marginLeft: leftOffset,
          transition: 'margin-left 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Header />
        <main className="flex-1 pt-14 p-5 overflow-auto">
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
    <SidebarProvider>
      <LayoutInner />
    </SidebarProvider>
  );
}
