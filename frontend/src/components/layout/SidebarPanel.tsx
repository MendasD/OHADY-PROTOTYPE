import { NavLink, useLocation } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { navModules } from '../../nav/navConfig';
import { useSidebar } from '../../context/SidebarContext';

const badgeColors: Record<string, string> = {
  red:    'bg-red-500 text-white',
  orange: 'bg-orange-400 text-white',
  blue:   'bg-blue-400 text-white',
  green:  'bg-green-500 text-white',
};

export default function SidebarPanel() {
  const { activeModule, panelOpen, setPanelOpen, barVisible } = useSidebar();
  const location = useLocation();

  const module = navModules.find(m => m.id === activeModule);

  // Si la barre principale est cachée, le panel doit l'être aussi
  if (!barVisible) return null;

  return (
    <div
      className="fixed inset-y-0 z-30 flex flex-col"
      style={{
        left: 84,
        width: panelOpen ? 220 : 0,
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        background: '#1A3C5E',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        boxShadow: panelOpen ? '3px 0 16px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      {module && (
        <div className="flex flex-col h-full" style={{ width: 220 }}>
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-4 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div>
              <div
                className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: module.accent }}
              >
                Module
              </div>
              <div className="text-white font-semibold text-sm leading-tight">
                {module.label}
              </div>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors border-0"
            >
              <X size={13} className="text-white/50" />
            </button>
          </div>

          {/* Exercice fiscal */}
          <div
            className="mx-3 my-2.5 px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div>
              <div className="text-white/35 text-[9px] uppercase tracking-widest">Exercice</div>
              <div className="text-white text-xs font-semibold">2025 – 2026</div>
            </div>
            <ChevronRight size={11} className="text-white/30" />
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.1) transparent',
          }}>
            {module.children.map(child => {
              const isActive = location.pathname === child.path;
              return (
                <NavLink
                  key={child.id}
                  to={child.path}
                  className={`
                    flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium
                    transition-all duration-150 no-underline
                    ${isActive
                      ? 'text-white'
                      : 'text-white/55 hover:text-white/85 hover:bg-white/8'
                    }
                  `}
                  style={isActive ? { background: `${module.accent}22`, boxShadow: `inset 2px 0 0 ${module.accent}` } : {}}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: isActive ? module.accent : 'rgba(255,255,255,0.2)' }}
                  />
                  <span className="flex-1 leading-snug">{child.label}</span>
                  {child.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${badgeColors[child.badgeColor || 'blue']}`}>
                      {child.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User profile */}
          <div
            className="px-3 pb-4 pt-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/8 cursor-pointer transition-all group">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: '#E67E22' }}
              >
                HC
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-semibold truncate">Hermann Cakpo</div>
                <div className="text-white/35 text-[10px] truncate">Directeur Financier</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
