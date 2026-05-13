import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Calculator,
  Wallet, Building2, RefreshCw, BarChart2,
  ShoppingCart, FileText, Users2, Bell,
  Package, Truck, CreditCard,
  BookOpen, List, PieChart, CalendarCheck,
  Bot, Scan, AlertTriangle,
  Settings, Shield, UserCog,
  ChevronDown, ChevronRight, Sparkles,
  LogOut, ChevronUp,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, TrendingUp, Calculator,
  Wallet, Building2, RefreshCw, BarChart2,
  ShoppingCart, FileText, Users2, Bell,
  Package, Truck, CreditCard,
  BookOpen, List, PieChart, CalendarCheck,
  Bot, Scan, AlertTriangle,
  Settings, Shield, UserCog,
};

interface NavChild { id: string; label: string; path: string; badge?: string; badgeColor?: string; icon?: string; }
interface NavSection { id: string; label: string; icon: string; path: string; accent: string; children: NavChild[]; }

const navSections: NavSection[] = [
  {
    id: 'pilotage', label: 'Pilotage', icon: 'LayoutDashboard', path: '/dashboard', accent: '#60A5FA',
    children: [
      { id: 'dashboard',    label: 'Tableau de bord',       path: '/dashboard',     icon: 'LayoutDashboard' },
      { id: 'budget',       label: 'Budget & Prévisions',   path: '/budget',        icon: 'TrendingUp' },
      { id: 'modelisation', label: 'Modélisation financière',path: '/modelisation',  icon: 'Calculator' },
    ],
  },
  {
    id: 'tresorerie', label: 'Trésorerie', icon: 'Wallet', path: '/tresorerie', accent: '#34D399',
    children: [
      { id: 'tresorerie',      label: 'Position de trésorerie',  path: '/tresorerie',      icon: 'Wallet' },
      { id: 'rapprochement',   label: 'Rapprochement bancaire',  path: '/rapprochement',   icon: 'RefreshCw', badge: '6', badgeColor: 'orange' },
      { id: 'prevision',       label: 'Prévision J+30',          path: '/prevision',       icon: 'BarChart2' },
    ],
  },
  {
    id: 'ventes', label: 'Ventes & Clients', icon: 'ShoppingCart', path: '/ventes', accent: '#A78BFA',
    children: [
      { id: 'ventes',       label: 'Facturation',     path: '/ventes',       icon: 'FileText' },
      { id: 'recouvrement', label: 'Recouvrement',    path: '/recouvrement', icon: 'Users2', badge: '4', badgeColor: 'red' },
      { id: 'relances',     label: 'Relances auto',   path: '/relances',     icon: 'Bell' },
    ],
  },
  {
    id: 'achats', label: 'Achats & Dépenses', icon: 'Package', path: '/achats', accent: '#FBBF24',
    children: [
      { id: 'achats',        label: 'Approbations',      path: '/achats',        icon: 'CreditCard', badge: '3', badgeColor: 'orange' },
      { id: 'fournisseurs',  label: 'Fournisseurs',      path: '/fournisseurs',  icon: 'Truck' },
      { id: 'avances',       label: 'Avances & frais',   path: '/avances',       icon: 'Package' },
    ],
  },
  {
    id: 'comptabilite', label: 'Comptabilité', icon: 'BookOpen', path: '/comptabilite', accent: '#F87171',
    children: [
      { id: 'comptabilite',   label: 'Journal',           path: '/comptabilite',   icon: 'List' },
      { id: 'plan-comptable', label: 'Plan comptable',    path: '/plan-comptable', icon: 'PieChart' },
      { id: 'cloture',        label: 'Clôture mensuelle', path: '/cloture',        icon: 'CalendarCheck' },
    ],
  },
  {
    id: 'intelligence', label: 'Intelligence IA', icon: 'Bot', path: '/intelligence', accent: '#C084FC',
    children: [
      { id: 'intelligence', label: 'Assistant IA',    path: '/intelligence', icon: 'Bot' },
      { id: 'ocr',          label: 'OCR & Saisie',    path: '/ocr',          icon: 'Scan' },
      { id: 'anomalies',    label: 'Anomalies',        path: '/anomalies',    icon: 'AlertTriangle', badge: '2', badgeColor: 'red' },
    ],
  },
  {
    id: 'administration', label: 'Administration', icon: 'Settings', path: '/administration', accent: '#94A3B8',
    children: [
      { id: 'administration', label: 'Paramétrage',    path: '/administration', icon: 'Settings' },
      { id: 'utilisateurs',   label: 'Utilisateurs',   path: '/utilisateurs',   icon: 'UserCog' },
      { id: 'securite',       label: 'Sécurité & RBAC',path: '/securite',       icon: 'Shield' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navSections.forEach(s => {
      initial[s.id] = s.children.some(c => location.pathname === c.path || location.pathname.startsWith(c.path + '/'));
      if (!Object.values(initial).some(Boolean) && s.id === 'pilotage') initial[s.id] = true;
    });
    return initial;
  });

  const toggle = (id: string) => setOpenSections(p => ({ ...p, [id]: !p[id] }));

  const badgeColors: Record<string, string> = {
    red: 'bg-red-500 text-white',
    orange: 'bg-orange-400 text-white',
    blue: 'bg-blue-400 text-white',
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-60 flex flex-col z-30" style={{ background: '#1A3C5E', boxShadow: '2px 0 12px rgba(0,0,0,0.18)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-primary text-sm" style={{ background: '#E67E22' }}>
          O
        </div>
        <div>
          <div className="text-white font-bold text-base leading-none">OHADY</div>
          <div className="text-white/40 text-[10px] leading-none mt-0.5">Finance & Comptabilité</div>
        </div>
      </div>

      {/* Exercice fiscal */}
      <div className="px-3 py-2.5 mx-3 my-2.5 rounded-lg flex items-center justify-between cursor-pointer" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div>
          <div className="text-white/40 text-[9px] uppercase tracking-widest">Exercice fiscal</div>
          <div className="text-white text-xs font-semibold">2025 – 2026</div>
        </div>
        <ChevronDown size={12} className="text-white/40" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-4">
        {navSections.map(section => {
          const SectionIcon = iconMap[section.icon];
          const isOpen = openSections[section.id];
          const isActive = section.children.some(c => location.pathname === c.path);

          return (
            <div key={section.id} className="mb-0.5">
              <button
                onClick={() => toggle(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                <SectionIcon size={16} style={{ color: isActive ? section.accent : undefined }} className={isActive ? '' : 'text-white/50'} />
                <span className="flex-1 text-left">{section.label}</span>
                {isOpen ? <ChevronUp size={12} className="text-white/40" /> : <ChevronRight size={12} className="text-white/40" />}
              </button>

              {isOpen && (
                <div className="ml-3 mt-0.5 space-y-0.5">
                  {section.children.map(child => {
                    const ChildIcon = child.icon ? iconMap[child.icon] : FileText;
                    const isChildActive = location.pathname === child.path;
                    return (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={`flex items-center gap-2.5 pl-5 pr-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                          isChildActive
                            ? 'bg-white/20 text-white'
                            : 'text-white/55 hover:bg-white/8 hover:text-white/90'
                        }`}
                      >
                        <ChildIcon size={13} className={isChildActive ? 'text-white' : 'text-white/40'} />
                        <span className="flex-1">{child.label}</span>
                        {child.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ${badgeColors[child.badgeColor || 'blue']}`}>
                            {child.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* AI Assistant shortcut */}
      <div className="px-3 pb-2">
        <NavLink to="/intelligence" className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all" style={{ background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.25)' }}>
          <Sparkles size={16} className="text-purple-300" />
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold">Assistant IA</div>
            <div className="text-white/40 text-[10px] truncate">Posez une question financière</div>
          </div>
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        </NavLink>
      </div>

      {/* User profile */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/8 cursor-pointer transition-all group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#E67E22' }}>
            HC
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">Hermann Cakpo</div>
            <div className="text-white/40 text-[10px] truncate">Directeur Financier</div>
          </div>
          <LogOut size={13} className="text-white/30 group-hover:text-white/60 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
