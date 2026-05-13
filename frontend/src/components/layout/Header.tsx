import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, Settings, CalendarDays, PanelLeftOpen } from 'lucide-react';
import { alerts } from '../../data/mockData';
import { navModules } from '../../nav/navConfig';
import { useSidebar } from '../../context/SidebarContext';

function getBreadcrumb(pathname: string): string[] {
  for (const mod of navModules) {
    for (const child of mod.children) {
      if (pathname === child.path || pathname.startsWith(child.path + '/')) {
        return [mod.label, child.label];
      }
    }
  }
  return ['OHADY'];
}

export default function Header() {
  const location = useLocation();
  const { barVisible, setBarVisible, setPanelOpen } = useSidebar();
  const [showNotifs, setShowNotifs] = useState(false);

  const crumbs = getBreadcrumb(location.pathname);
  const unread = alerts.filter(a => a.type === 'error' || a.type === 'warning').length;

  const alertDot: Record<string, string> = {
    error: 'bg-red-500', warning: 'bg-orange-400', info: 'bg-blue-400', success: 'bg-green-500',
  };
  const alertBg: Record<string, string> = {
    error: 'border-l-4 border-red-400 bg-red-50',
    warning: 'border-l-4 border-orange-400 bg-orange-50',
    info: 'border-l-4 border-blue-300 bg-blue-50',
    success: 'border-l-4 border-green-400 bg-green-50',
  };

  return (
    <header className="fixed top-0 right-0 z-20 h-14 bg-white flex items-center px-5 gap-3"
      style={{
        left: 0,
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Show sidebar toggle */}
      {!barVisible && (
        <button
          onClick={() => { setBarVisible(true); setPanelOpen(true); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors flex-shrink-0"
        >
          <PanelLeftOpen size={16} className="text-neutral-500" />
        </button>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        <span className="text-neutral-400 font-medium hidden sm:block text-xs">OHADY</span>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-neutral-300 text-xs hidden sm:block">/</span>
            <span className={i === crumbs.length - 1
              ? 'font-semibold text-neutral-800 text-sm truncate'
              : 'text-neutral-400 text-xs hidden sm:block'
            }>
              {c}
            </span>
          </span>
        ))}
      </nav>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all w-64 placeholder:text-neutral-400"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-mono bg-neutral-100 px-1.5 py-0.5 rounded hidden lg:block">⌘K</kbd>
      </div>

      {/* Fiscal year */}
      <button className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-all text-xs">
        <CalendarDays size={12} className="text-neutral-500" />
        <span className="font-medium text-neutral-700">2025–2026</span>
        <ChevronDown size={11} className="text-neutral-400" />
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifs(p => !p)}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors"
        >
          <Bell size={16} className="text-neutral-600" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {showNotifs && (
          <div className="absolute right-0 top-10 w-96 bg-white rounded-xl shadow-card-md border border-neutral-100 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
              <span className="font-semibold text-neutral-800 text-sm">Notifications</span>
              <div className="flex items-center gap-2">
                <span className="badge badge-red text-[10px]">{unread}</span>
                <button className="text-xs text-neutral-400 hover:text-neutral-600">Tout lire</button>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-50">
              {alerts.map(alert => (
                <div key={alert.id} className={`px-4 py-3 flex gap-3 cursor-pointer hover:brightness-95 transition-all ${alertBg[alert.type]}`}>
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${alertDot[alert.type]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-neutral-800">{alert.title}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{alert.description}</div>
                    <div className="text-[10px] text-neutral-400 mt-1">{alert.createdAt}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-neutral-100 text-center">
              <button className="text-xs text-secondary font-medium hover:underline">Voir toutes les notifications</button>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors">
        <Settings size={16} className="text-neutral-500" />
      </button>

      {/* User */}
      <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
          style={{ background: '#E67E22' }}>
          HC
        </div>
        <div className="hidden lg:block text-left">
          <div className="text-xs font-semibold text-neutral-800 leading-none">H. Cakpo</div>
          <div className="text-[10px] text-neutral-400 leading-none mt-0.5">DAF</div>
        </div>
        <ChevronDown size={11} className="text-neutral-400" />
      </button>
    </header>
  );
}
