import { useState } from 'react';
import {
  Bell, CheckCircle, AlertTriangle, Info, AlertCircle, Filter, Search,
  Check, X, Sparkles, Mail, Smartphone, MessageCircle, Settings as SettingsIcon,
} from 'lucide-react';
import { alerts } from '../data/mockData';

type FilterKey = 'all' | 'unread' | 'error' | 'warning' | 'info' | 'success';

const iconMeta = {
  error:   { Icon: AlertTriangle, color: 'text-danger',  bg: 'bg-red-50',    border: 'border-red-200' },
  warning: { Icon: AlertCircle,   color: 'text-warning', bg: 'bg-orange-50', border: 'border-orange-200' },
  info:    { Icon: Info,          color: 'text-secondary', bg: 'bg-blue-50', border: 'border-blue-200' },
  success: { Icon: CheckCircle,   color: 'text-success', bg: 'bg-green-50',  border: 'border-green-200' },
};

export default function Notifications() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const filtered = alerts.filter(a => {
    if (filter === 'unread' && readIds.has(a.id)) return false;
    if (filter !== 'all' && filter !== 'unread' && a.type !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: alerts.length,
    unread: alerts.filter(a => !readIds.has(a.id)).length,
    error: alerts.filter(a => a.type === 'error').length,
    warning: alerts.filter(a => a.type === 'warning').length,
    info: alerts.filter(a => a.type === 'info').length,
    success: alerts.filter(a => a.type === 'success').length,
  };

  const markRead = (id: string) => setReadIds(s => { const n = new Set(s); n.add(id); return n; });
  const markAllRead = () => setReadIds(new Set(alerts.map(a => a.id)));

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Bell size={20} className="text-secondary" /> Centre de notifications
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Toutes les alertes et messages · {counts.unread} non lus</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={markAllRead} className="btn btn-outline btn-sm"><Check size={12} /> Tout marquer comme lu</button>
          <button className="btn btn-outline btn-sm"><SettingsIcon size={12} /> Préférences</button>
        </div>
      </div>

      {/* Préférences canaux */}
      <div className="card">
        <h3 className="text-sm font-bold text-neutral-700 mb-3">Canaux de notification</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { Icon: Bell, label: 'In-app', active: true },
            { Icon: Mail, label: 'Email', active: true },
            { Icon: MessageCircle, label: 'WhatsApp', active: false },
            { Icon: Smartphone, label: 'SMS', active: true },
          ].map(c => {
            const Icon = c.Icon;
            return (
              <div key={c.label} className={`rounded-lg border p-3 flex items-center gap-3 ${c.active ? 'border-secondary bg-secondary/5' : 'border-neutral-200 bg-neutral-50/40'}`}>
                <Icon size={16} className={c.active ? 'text-secondary' : 'text-neutral-400'} />
                <span className={`text-sm font-medium flex-1 ${c.active ? 'text-secondary' : 'text-neutral-500'}`}>{c.label}</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={c.active} className="sr-only peer" />
                  <span className="relative w-9 h-5 bg-neutral-200 peer-checked:bg-secondary rounded-full transition-all">
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${c.active ? 'translate-x-4' : ''}`} />
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtres + search */}
      <div className="card-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-md">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-8 py-1.5 text-xs"
            placeholder="Rechercher dans les notifications..."
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {(['all', 'unread', 'error', 'warning', 'info', 'success'] as FilterKey[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all ${
                filter === f
                  ? 'border-secondary bg-secondary/10 text-secondary font-semibold'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {f === 'all' ? 'Toutes' : f === 'unread' ? 'Non lues' : f}
              <span className="font-mono text-neutral-500">({counts[f]})</span>
            </button>
          ))}
        </div>
        <button className="btn btn-outline btn-sm"><Filter size={11} /> Période</button>
      </div>

      {/* Liste */}
      <div className="card !p-0 overflow-hidden">
        <div className="divide-y divide-neutral-50">
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center">
              <Bell size={32} className="mx-auto text-neutral-200 mb-3" />
              <div className="text-sm font-semibold text-neutral-600">Aucune notification</div>
              <div className="text-xs text-neutral-400 mt-1">Vous êtes à jour.</div>
            </div>
          )}
          {filtered.map(a => {
            const meta = iconMeta[a.type as keyof typeof iconMeta];
            const Icon = meta.Icon;
            const isRead = readIds.has(a.id);
            return (
              <div key={a.id} className={`px-5 py-3.5 flex items-start gap-3 hover:bg-neutral-50/40 transition-colors ${!isRead ? 'bg-blue-50/20' : ''}`}>
                <div className={`w-9 h-9 rounded-lg grid place-items-center flex-shrink-0 ${meta.bg}`}>
                  <Icon size={15} className={meta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm ${!isRead ? 'font-bold text-neutral-800' : 'font-medium text-neutral-700'}`}>
                      {a.title}
                      {!isRead && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-secondary align-middle" />}
                    </span>
                    <span className="text-[10px] text-neutral-400 flex-shrink-0 font-mono">{a.createdAt}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 leading-snug">{a.description}</p>
                  {a.action && (
                    <button className={`text-xs font-semibold mt-2 ${meta.color} hover:underline`}>
                      {a.action} →
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {!isRead && (
                    <button onClick={() => markRead(a.id)} className="w-7 h-7 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-success grid place-items-center" title="Marquer lu">
                      <Check size={13} />
                    </button>
                  )}
                  <button className="w-7 h-7 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-danger grid place-items-center" title="Supprimer">
                    <X size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* IA insight */}
      <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
        <Sparkles size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-neutral-700 leading-relaxed">
          <strong>L'IA réduit le bruit :</strong> seules les alertes critiques (rouge / orange) déclenchent une notification SMS ou WhatsApp.
          Les notifications informatives restent uniquement in-app et email pour ne pas vous saturer.
        </div>
      </div>
    </div>
  );
}
