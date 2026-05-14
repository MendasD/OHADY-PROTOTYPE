import { useMemo, useState } from 'react';
import {
  Search, Link2, CheckCircle, Filter, Sparkles, X,
  ArrowRight,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

interface Tiers { code: string; nom: string; type: 'client' | 'fournisseur'; soldeOuverture: number }
const tiersList: Tiers[] = [
  { code: 'C001', nom: 'SONES',                  type: 'client',      soldeOuverture: 8_400_000 },
  { code: 'C002', nom: 'Dakar Dem Dikk',         type: 'client',      soldeOuverture: 4_200_000 },
  { code: 'C003', nom: 'Ministère des Finances', type: 'client',      soldeOuverture: 12_600_000 },
  { code: 'C004', nom: 'SENELEC',                type: 'client',      soldeOuverture: 5_800_000 },
  { code: 'C005', nom: 'Tech Solutions SARL',    type: 'client',      soldeOuverture: 3_500_000 },
  { code: 'F001', nom: 'COGEMATEC SARL',         type: 'fournisseur', soldeOuverture: 2_124_000 },
  { code: 'F002', nom: 'SETUMA',                 type: 'fournisseur', soldeOuverture: 920_000 },
];

interface Operation {
  id: string;
  date: string;
  ref: string;
  libelle: string;
  montant: number;
  type: 'facture' | 'reglement' | 'avoir';
  lettre?: string;
  selected?: boolean;
}

const operationsParTiers: Record<string, Operation[]> = {
  C001: [
    { id: 'o1', date: '02/04/2026', ref: 'F2026-0148', libelle: 'Facture prestations Q1',                montant: 4_200_000, type: 'facture' },
    { id: 'o2', date: '05/05/2026', ref: 'F2026-0151', libelle: 'Facture prestations avril',              montant: 8_400_000, type: 'facture' },
    { id: 'o3', date: '06/05/2026', ref: 'BQ-2026-0808', libelle: 'Virement reçu — règlement partiel',     montant: -4_200_000, type: 'reglement' },
  ],
  C003: [
    { id: 'o4', date: '10/04/2026', ref: 'F2026-0143', libelle: 'Facture mission audit',                 montant: 12_600_000, type: 'facture' },
  ],
  C005: [
    { id: 'o5', date: '02/05/2026', ref: 'F2026-0142', libelle: 'Facture prestation conseil',             montant: 3_500_000, type: 'facture' },
    { id: 'o6', date: '13/05/2026', ref: 'BQ-2026-0821', libelle: 'Virement Tech Solutions',              montant: -3_500_000, type: 'reglement' },
  ],
  F001: [
    { id: 'o7', date: '12/05/2026', ref: 'COGE-1247', libelle: 'Achat marchandises',                      montant: -2_124_000, type: 'facture' },
  ],
};

export default function Lettrage() {
  const [filter, setFilter] = useState<'all' | 'client' | 'fournisseur'>('all');
  const [search, setSearch] = useState('');
  const [selectedTiers, setSelectedTiers] = useState<string>('C001');
  const [selectedOps, setSelectedOps] = useState<Set<string>>(new Set());

  const tiersFiltres = tiersList.filter(t =>
    (filter === 'all' || t.type === filter) &&
    (!search || t.nom.toLowerCase().includes(search.toLowerCase()) || t.code.includes(search))
  );

  const ops = operationsParTiers[selectedTiers] ?? [];
  const tiers = tiersList.find(t => t.code === selectedTiers)!;

  const totalSelected = useMemo(() =>
    ops.filter(o => selectedOps.has(o.id)).reduce((s, o) => s + o.montant, 0),
    [selectedOps, ops]
  );
  const ecartSelection = Math.abs(totalSelected);
  const peutLettrer = selectedOps.size >= 2 && ecartSelection < 1;

  const toggle = (id: string) => setSelectedOps(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const reset = () => setSelectedOps(new Set());
  const letterIA = () => {
    // Auto-select first facture + reglement that balance
    const ns = new Set<string>();
    let total = 0;
    ops.filter(o => !o.lettre).forEach(o => {
      ns.add(o.id);
      total += o.montant;
      if (Math.abs(total) < 1) return;
    });
    setSelectedOps(ns);
  };

  const stats = useMemo(() => {
    const total = ops.reduce((s, o) => s + (o.type === 'facture' ? o.montant : 0), 0);
    const regle = ops.filter(o => o.type === 'reglement').reduce((s, o) => s + Math.abs(o.montant), 0);
    return { total, regle, du: total - regle };
  }, [ops]);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Lettrage</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Rapprochez les règlements et les factures du même tiers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Filter size={12} /> Filtres avancés</button>
          <button onClick={letterIA} className="btn btn-outline btn-sm border-purple-200 text-purple-700">
            <Sparkles size={12} /> Lettrage assisté
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
        {/* Liste tiers */}
        <div className="card !p-0 overflow-hidden h-fit xl:sticky xl:top-20">
          <div className="px-4 py-3 border-b border-neutral-100">
            <div className="inline-flex w-full rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 mb-2">
              {(['all', 'client', 'fournisseur'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-1 px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                    filter === t ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  {t === 'all' ? 'Tous' : t === 'client' ? 'Clients' : 'Fournisseurs'}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                className="input pl-8 py-1.5 text-xs" placeholder="Tiers..."
              />
            </div>
          </div>
          <div className="divide-y divide-neutral-50 max-h-[640px] overflow-y-auto">
            {tiersFiltres.map(t => {
              const tops = operationsParTiers[t.code] ?? [];
              const lettres = tops.filter(o => o.lettre).length;
              const nonLettres = tops.length - lettres;
              return (
                <button
                  key={t.code}
                  onClick={() => { setSelectedTiers(t.code); reset(); }}
                  className={`w-full px-4 py-2.5 text-left transition-colors ${
                    t.code === selectedTiers ? 'bg-secondary/5 border-l-2 border-secondary' : 'hover:bg-neutral-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold ${t.type === 'client' ? 'text-green-700' : 'text-orange-700'}`}>{t.code}</span>
                    <span className={`badge ${t.type === 'client' ? 'badge-green' : 'badge-orange'} text-[9px]`}>{t.type}</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-800 mt-0.5 truncate">{t.nom}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-2">
                    <span>{tops.length} op.</span>
                    {nonLettres > 0 && <span className="text-warning font-semibold">{nonLettres} à lettrer</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tiers détail */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary grid place-items-center font-bold text-base flex-shrink-0">
                  {tiers.nom.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-neutral-800">{tiers.nom}</span>
                    <span className={`badge ${tiers.type === 'client' ? 'badge-green' : 'badge-orange'} text-[10px]`}>{tiers.type}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">{tiers.code}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wide text-neutral-400">Solde dû</div>
                <div className={`text-lg font-bold font-mono ${stats.du > 0 ? 'text-warning' : 'text-success'}`}>{fmtXOF(stats.du)}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Stat label="Total facturé" value={fmtXOF(stats.total)} />
              <Stat label="Total réglé" value={fmtXOF(stats.regle)} tone="success" />
              <Stat label="Reste dû" value={fmtXOF(Math.max(0, stats.du))} tone={stats.du > 0 ? 'warning' : 'success'} />
            </div>
          </div>

          {/* Mode lettrage */}
          <div className={`card border-l-4 transition-all ${
            selectedOps.size === 0 ? 'border-l-neutral-200' :
            peutLettrer ? 'border-l-green-400 bg-green-50/30' : 'border-l-orange-400 bg-orange-50/30'
          }`}>
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg grid place-items-center ${
                  peutLettrer ? 'bg-green-100 text-success' : selectedOps.size === 0 ? 'bg-neutral-100 text-neutral-400' : 'bg-orange-100 text-warning'
                }`}>
                  {peutLettrer ? <CheckCircle size={16} /> : <Link2 size={16} />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-800">
                    {selectedOps.size === 0 ? 'Sélectionnez 2 opérations ou plus' :
                     peutLettrer ? `Lettrage équilibré — ${selectedOps.size} opérations` :
                     `${selectedOps.size} sélectionnées — écart de ${fmt(ecartSelection)} XOF`}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {selectedOps.size > 0 && `Total : ${fmt(totalSelected)} XOF`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedOps.size > 0 && (
                  <button onClick={reset} className="btn btn-outline btn-sm"><X size={12} /> Annuler</button>
                )}
                <button
                  disabled={!peutLettrer}
                  className={`btn btn-sm ${peutLettrer ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}
                >
                  <Link2 size={12} /> Lettrer
                </button>
              </div>
            </div>
          </div>

          {/* Opérations */}
          <div className="card !p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-700">Opérations du tiers · {ops.length}</h3>
              <span className="text-[11px] text-neutral-400">Cochez les opérations à rapprocher</span>
            </div>
            {ops.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-neutral-400">
                Aucune opération pour ce tiers.
              </div>
            ) : (
              <div className="divide-y divide-neutral-50">
                {ops.map(o => {
                  const isSelected = selectedOps.has(o.id);
                  const isLettered = !!o.lettre;
                  return (
                    <label
                      key={o.id}
                      className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${
                        isLettered ? 'bg-green-50/30 opacity-60' :
                        isSelected ? 'bg-secondary/5' : 'hover:bg-neutral-50/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={isLettered}
                        checked={isSelected || isLettered}
                        onChange={() => !isLettered && toggle(o.id)}
                        className="h-4 w-4 rounded border-neutral-300 accent-secondary"
                      />
                      <div className="w-20 text-xs text-neutral-500 font-mono flex-shrink-0">{o.date}</div>
                      <div className="w-32 flex-shrink-0">
                        <span className="font-mono text-xs text-neutral-700">{o.ref}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-neutral-800 truncate">{o.libelle}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`badge text-[10px] ${
                            o.type === 'facture' ? 'badge-blue' : o.type === 'reglement' ? 'badge-green' : 'badge-orange'
                          }`}>
                            {o.type}
                          </span>
                          {isLettered && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-success font-semibold">
                              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 grid place-items-center text-[9px] font-bold">{o.lettre}</span>
                              Lettré
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`text-right flex-shrink-0 font-mono text-sm font-semibold ${o.montant > 0 ? 'text-neutral-700' : 'text-success'}`}>
                        {o.montant > 0 ? '+' : ''}{fmt(o.montant)} XOF
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Aide */}
          <div className="card bg-neutral-50/50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
              <Sparkles size={14} className="text-purple-600" />
            </div>
            <div className="text-[12px] text-neutral-700 leading-relaxed">
              <strong>Lettrage automatique :</strong> l'IA peut proposer des appariements basés sur le montant, la date et la référence.
              Cliquez sur "Lettrage assisté" en haut pour générer des suggestions, puis validez celles qui sont correctes.
              <button className="ml-1 text-purple-600 font-semibold hover:underline inline-flex items-center gap-0.5">
                En savoir plus <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'success' | 'warning' }) {
  const tones = {
    success: 'text-success',
    warning: 'text-warning',
  };
  return (
    <div className="rounded-lg border border-neutral-100 bg-neutral-50/40 p-3">
      <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-semibold">{label}</div>
      <div className={`mt-1 text-base font-bold font-mono ${tone ? tones[tone] : 'text-neutral-800'}`}>{value}</div>
    </div>
  );
}
