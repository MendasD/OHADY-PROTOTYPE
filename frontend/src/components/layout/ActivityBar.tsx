import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Wallet, ShoppingCart, Package, BookOpen,
  Users, Archive, Bot, Settings, PanelLeftClose,
  Sparkles, Percent, Lock,
} from 'lucide-react';
import { navModules } from '../../nav/navConfig';
import { useSidebar } from '../../context/SidebarContext';
import { usePersona } from '../../context/PersonaContext';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Wallet, ShoppingCart, Package, BookOpen,
  Users, Archive, Bot, Settings, Percent, Lock,
};

export default function ActivityBar() {
  const { activeModule, panelOpen, toggleModule, setActiveModule, setPanelOpen, barVisible, setBarVisible, setIaOpen } = useSidebar();
  const { persona } = usePersona();
  const location = useLocation();
  const navigate = useNavigate();

  // Nav adaptative : filtre les modules selon le persona
  const visibleModules = persona.allowedModules === 'all'
    ? navModules
    : navModules.filter(m => (persona.allowedModules as string[]).includes(m.id));

  const handleModuleClick = (moduleId: string) => {
    const mod = navModules.find(m => m.id === moduleId);
    if (!mod) return;
    const alreadyInModule = mod.children.some(
      c => location.pathname === c.path || location.pathname.startsWith(c.path + '/'),
    );
    if (alreadyInModule) {
      // Same module — just toggle the panel
      toggleModule(moduleId);
    } else {
      // Different module — navigate to its first child and ensure panel is open
      setActiveModule(moduleId);
      setPanelOpen(true);
      navigate(mod.children[0].path);
    }
  };

  const isModuleActive = (moduleId: string) =>
    navModules.find(m => m.id === moduleId)
      ?.children.some(c => location.pathname === c.path || location.pathname.startsWith(c.path + '/'))
    ?? false;

  if (!barVisible) return null;

  return (
    <div
      className="fixed inset-y-0 left-0 z-40 flex flex-col items-center py-3 gap-1"
      style={{
        width: 84,
        background: '#0F2537',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '2px 0 8px rgba(0,0,0,0.25)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-3 flex-shrink-0"
        style={{ background: '#E67E22' }}>
        <span className="text-white font-black text-lg">O</span>
      </div>

      {/* Module icons (filtrés selon persona, liste plate, Pilotage en tête) */}
      <nav className="flex-1 flex flex-col items-center gap-0.5 w-full px-2 overflow-y-auto">
        {visibleModules.map(mod => {
          const Icon = iconMap[mod.icon] || LayoutDashboard;
          const isActive = isModuleActive(mod.id);
          const isSelected = activeModule === mod.id && panelOpen;
          return (
            <button
              key={mod.id}
              onClick={() => handleModuleClick(mod.id)}
              title={mod.label}
              className={`
                relative w-full flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl
                transition-all duration-150 group cursor-pointer border-0
                ${isSelected
                  ? 'bg-white/15'
                  : isActive
                    ? 'bg-white/10'
                    : 'hover:bg-white/8'
                }
              `}
            >
              {(isActive || isSelected) && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: mod.accent }}
                />
              )}
              <Icon
                size={18}
                style={{ color: isSelected ? mod.accent : isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)' }}
                className="transition-colors"
              />
              <span
                className="text-[9px] font-medium leading-none text-center px-1 transition-colors"
                style={{
                  color: isSelected ? 'rgba(255,255,255,0.95)'
                    : isActive ? 'rgba(255,255,255,0.75)'
                    : 'rgba(255,255,255,0.35)',
                }}
              >
                {mod.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-1 w-full px-2">
        {/* IA Quick */}
        <button
          onClick={() => setIaOpen(true)}
          title="Assistant IA"
          className="w-full flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl hover:bg-purple-500/20 transition-all border-0"
        >
          <Sparkles size={18} className="text-purple-400" />
          <span className="text-[9px] text-purple-400 font-medium">IA</span>
        </button>

        {/* Collapse bar */}
        <button
          onClick={() => { setBarVisible(false); setPanelOpen(false); }}
          title="Masquer la barre latérale"
          className="w-full flex flex-col items-center justify-center py-2.5 rounded-xl hover:bg-white/8 transition-all border-0"
        >
          <PanelLeftClose size={16} className="text-white/30" />
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1 cursor-pointer"
          style={{ background: '#E67E22' }}
          title="Hermann Cakpo — DAF"
        >
          HC
        </div>
      </div>
    </div>
  );
}
