import { useState } from 'react';
import {
  Search, Mail, Phone, MapPin, Building2, FileText, Receipt,
  TrendingUp, TrendingDown, Sparkles, Edit, Send,
  Plus, Globe, Briefcase,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';

type TierType = 'client' | 'fournisseur';

interface Tier {
  code: string;
  nom: string;
  type: TierType;
  contact: string;
  email: string;
  tel: string;
  adresse: string;
  ninea: string;
  rc: string;
  pays: string;
  conditions: string;
  encoursAutorise: number;
  encoursActuel: number;
  ca12mois: number;
  scoreRisque: 'A' | 'B' | 'C' | 'D';
  dso: number;
  factures: number;
  retards: number;
}

const tiers: Tier[] = [
  { code: 'C001', nom: 'SONES',                  type: 'client', contact: 'M. Faye Mamadou', email: 'm.faye@sones.sn', tel: '+221 33 859 12 34', adresse: 'Rte du Front de Terre, Dakar', ninea: '0010547821 B2', rc: 'SN.DKR.2003.5821', pays: 'Sénégal',         conditions: 'Net 30 jours', encoursAutorise: 25_000_000, encoursActuel: 8_400_000, ca12mois: 84_500_000, scoreRisque: 'A', dso: 32, factures: 28, retards: 0 },
  { code: 'C003', nom: 'Ministère des Finances', type: 'client', contact: 'Direction Achats', email: 'achats@finances.gouv.sn', tel: '+221 33 889 50 00', adresse: 'Building Adm., Plateau, Dakar', ninea: '00000001 A0', rc: 'État', pays: 'Sénégal', conditions: 'Net 60 jours', encoursAutorise: 50_000_000, encoursActuel: 12_600_000, ca12mois: 32_400_000, scoreRisque: 'B', dso: 78, factures: 8, retards: 1 },
  { code: 'F001', nom: 'COGEMATEC SARL',         type: 'fournisseur', contact: 'Cisse Khady', email: 'k.cisse@cogematec.sn', tel: '+221 77 234 56 78', adresse: 'Zone industrielle, Pikine', ninea: '0014785236 B1', rc: 'SN.PIK.2018.124', pays: 'Sénégal', conditions: 'Net 30 jours', encoursAutorise: 10_000_000, encoursActuel: 2_124_000, ca12mois: 18_500_000, scoreRisque: 'A', dso: 0, factures: 14, retards: 0 },
];

const caHistorique = [
  { mois: 'Jun 25', ca: 5_200_000 }, { mois: 'Jul 25', ca: 6_800_000 }, { mois: 'Aoû 25', ca: 4_900_000 },
  { mois: 'Sep 25', ca: 7_400_000 }, { mois: 'Oct 25', ca: 8_200_000 }, { mois: 'Nov 25', ca: 6_500_000 },
  { mois: 'Déc 25', ca: 9_800_000 }, { mois: 'Jan 26', ca: 7_100_000 }, { mois: 'Fév 26', ca: 8_400_000 },
  { mois: 'Mar 26', ca: 9_200_000 }, { mois: 'Avr 26', ca: 6_700_000 }, { mois: 'Mai 26', ca: 8_400_000 },
];

const facturesRecentes = [
  { ref: 'F2026-0151', date: '05/05/2026', echeance: '04/06/2026', montant: 9_912_000, statut: 'envoyee', jours: 0 },
  { ref: 'F2026-0143', date: '10/04/2026', echeance: '10/05/2026', montant: 12_600_000, statut: 'retard', jours: 33 },
  { ref: 'F2026-0128', date: '02/03/2026', echeance: '01/04/2026', montant: 5_800_000, statut: 'paye', jours: 0 },
  { ref: 'F2026-0119', date: '15/02/2026', echeance: '17/03/2026', montant: 7_400_000, statut: 'paye', jours: 0 },
];

const interactions = [
  { date: '13/05/2026', user: 'Awa', action: 'Email relance', desc: 'Relance facture F2026-0143 (33j retard)', icon: Mail, color: 'text-secondary' },
  { date: '08/05/2026', user: 'Doudou', action: 'Note interne', desc: 'Client confirmé que le paiement est en cours de validation hiérarchique', icon: FileText, color: 'text-neutral-600' },
  { date: '05/05/2026', user: 'Hermann', action: 'Facture émise', desc: 'F2026-0151 — Mission Q2 audit interne', icon: Receipt, color: 'text-success' },
  { date: '28/04/2026', user: 'Awa', action: 'Appel client', desc: 'Confirmation BC et plan de paiement (2 acomptes)', icon: Phone, color: 'text-secondary' },
];

const scoreMeta = {
  A: { label: 'Excellent', cls: 'bg-green-100 text-green-700 border-green-200', color: '#27AE60' },
  B: { label: 'Bon',       cls: 'bg-blue-100 text-blue-700 border-blue-200', color: '#2980B9' },
  C: { label: 'Moyen',     cls: 'bg-orange-100 text-orange-700 border-orange-200', color: '#F39C12' },
  D: { label: 'Risque',    cls: 'bg-red-100 text-red-700 border-red-200', color: '#E74C3C' },
};

export default function FicheTier() {
  const [selectedCode, setSelectedCode] = useState('C001');
  const [search, setSearch] = useState('');
  const tier = tiers.find(t => t.code === selectedCode)!;
  const meta = scoreMeta[tier.scoreRisque];

  const encoursPct = Math.round((tier.encoursActuel / tier.encoursAutorise) * 100);

  const filtered = tiers.filter(t => !search || t.nom.toLowerCase().includes(search.toLowerCase()) || t.code.includes(search));

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Fiche tier</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Vue 360° client / fournisseur · encours, historique, interactions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Edit size={12} /> Modifier</button>
          <button className="btn btn-primary btn-sm"><Plus size={12} /> Nouvelle facture</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-5">
        {/* Sidebar liste */}
        <div className="card !p-0 overflow-hidden h-fit xl:sticky xl:top-20">
          <div className="px-4 py-3 border-b border-neutral-100">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                className="input pl-8 py-1.5 text-xs" placeholder="Rechercher un tier..."
              />
            </div>
          </div>
          <div className="divide-y divide-neutral-50 max-h-[500px] overflow-y-auto">
            {filtered.map(t => (
              <button
                key={t.code}
                onClick={() => setSelectedCode(t.code)}
                className={`w-full px-4 py-2.5 text-left transition-colors ${
                  t.code === selectedCode ? 'bg-secondary/5 border-l-2 border-secondary' : 'hover:bg-neutral-50/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold ${t.type === 'client' ? 'text-green-700' : 'text-orange-700'}`}>{t.code}</span>
                  <span className={`badge ${t.type === 'client' ? 'badge-green' : 'badge-orange'} text-[9px]`}>{t.type}</span>
                </div>
                <div className="text-xs font-semibold text-neutral-800 mt-0.5 truncate">{t.nom}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">CA 12m : {fmt(t.ca12mois)} XOF</div>
              </button>
            ))}
          </div>
        </div>

        {/* Détail */}
        <div className="space-y-4">
          {/* Header tier */}
          <div className="card relative overflow-hidden">
            <div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10"
              style={{ background: meta.color }}
            />
            <div className="relative flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl grid place-items-center text-white font-bold text-xl flex-shrink-0 shadow-md" style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
                {tier.nom.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-neutral-800">{tier.nom}</h2>
                  <span className={`badge ${tier.type === 'client' ? 'badge-green' : 'badge-orange'} text-[10px]`}>{tier.type}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.cls}`}>
                    Score {tier.scoreRisque} · {meta.label}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-3 flex-wrap">
                  <span className="font-mono">{tier.code}</span>
                  <span className="flex items-center gap-1"><Globe size={10} /> {tier.pays}</span>
                  <span className="flex items-center gap-1"><Briefcase size={10} /> {tier.conditions}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-[11px] text-neutral-600">
                  <Info icon={Mail} text={tier.email} />
                  <Info icon={Phone} text={tier.tel} />
                  <Info icon={MapPin} text={tier.adresse} />
                  <Info icon={Building2} text={`NINEA ${tier.ninea}`} />
                </div>
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="CA 12 derniers mois" value={fmtXOF(tier.ca12mois)} tone="success" trend={+14.2} />
            <KpiCard label="Encours actuel" value={fmtXOF(tier.encoursActuel)} tone="info" sub={`/ ${fmt(tier.encoursAutorise)} max`} />
            <KpiCard label="DSO" value={`${tier.dso} j`} tone={tier.dso > 60 ? 'warning' : 'success'} sub="Délai moyen paiement" />
            <KpiCard label="Factures" value={tier.factures.toString()} tone="primary" sub={`${tier.retards} en retard`} />
          </div>

          {/* Encours visuel */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-700">Encours / Plafond autorisé</h3>
              <span className={`text-xs font-bold ${encoursPct > 80 ? 'text-warning' : 'text-success'}`}>{encoursPct} %</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${encoursPct > 80 ? 'bg-warning' : 'bg-success'}`}
                style={{ width: `${Math.min(encoursPct, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2">
              <span>{fmt(tier.encoursActuel)} XOF utilisés</span>
              <span>Reste {fmt(tier.encoursAutorise - tier.encoursActuel)} XOF</span>
            </div>
          </div>

          {/* CA graphique */}
          <div className="card">
            <h3 className="text-sm font-bold text-neutral-700 mb-3">Évolution du CA — 12 derniers mois</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={caHistorique} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="caTier" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={meta.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={meta.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1_000_000).toFixed(0)} M`} />
                <Tooltip formatter={(v: any) => fmtXOF(Number(v))} contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="ca" stroke={meta.color} strokeWidth={2.5} fill="url(#caTier)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Factures récentes */}
            <div className="card !p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-700">Factures récentes</h3>
              </div>
              <div className="divide-y divide-neutral-50">
                {facturesRecentes.map(f => (
                  <div key={f.ref} className="px-5 py-2.5 flex items-center gap-3">
                    <Receipt size={14} className={
                      f.statut === 'paye' ? 'text-success' :
                      f.statut === 'retard' ? 'text-warning' : 'text-secondary'
                    } />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-neutral-700">{f.ref}</div>
                      <div className="text-[10px] text-neutral-500">
                        Émise {f.date} · Échéance {f.echeance}
                        {f.statut === 'retard' && <span className="ml-1 text-warning font-semibold">· {f.jours} j retard</span>}
                      </div>
                    </div>
                    <div className="text-sm font-mono font-semibold text-neutral-800">{fmt(f.montant)}</div>
                    <span className={`badge text-[9px] ${
                      f.statut === 'paye' ? 'badge-green' : f.statut === 'retard' ? 'badge-orange' : 'badge-blue'
                    }`}>
                      {f.statut === 'paye' ? 'Payée' : f.statut === 'retard' ? 'En retard' : 'Envoyée'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactions */}
            <div className="card !p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-700">Interactions récentes</h3>
              </div>
              <div className="divide-y divide-neutral-50">
                {interactions.map((i, idx) => {
                  const Icon = i.icon;
                  return (
                    <div key={idx} className="px-5 py-2.5 flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full bg-neutral-50 grid place-items-center flex-shrink-0 ${i.color}`}>
                        <Icon size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-neutral-800">{i.action}</div>
                        <div className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{i.desc}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{i.date} · {i.user}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-neutral-100 px-5 py-2 flex items-center gap-2">
                <button className="btn btn-outline btn-sm flex-1 justify-center"><Send size={11} /> Email</button>
                <button className="btn btn-outline btn-sm flex-1 justify-center"><Phone size={11} /> Appel</button>
                <button className="btn btn-outline btn-sm flex-1 justify-center"><FileText size={11} /> Note</button>
              </div>
            </div>
          </div>

          {/* IA insight */}
          <div className="card border-l-4 border-purple-300 bg-purple-50/30 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 grid place-items-center flex-shrink-0">
              <Sparkles size={16} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-purple-700">Analyse IA</div>
              <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                <strong>{tier.nom}</strong> représente <strong>{Math.round(tier.ca12mois / 540_000_000 * 100)} %</strong> du CA total annuel.
                {tier.retards > 0 && <span className="ml-1">Le client a <strong className="text-warning">{tier.retards} facture(s) en retard</strong> — risque potentiel sur la trésorerie de juin.</span>}
                {tier.dso > 60 && <span className="ml-1 text-warning font-semibold">Le DSO de {tier.dso} jours dépasse la médiane secteur (35-40 j) — revoir les conditions ?</span>}
                {tier.dso <= 35 && <span className="ml-1 text-success font-semibold">Excellent DSO de {tier.dso} jours — client modèle pour le portefeuille.</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={11} className="text-neutral-400 flex-shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function KpiCard({ label, value, tone, sub, trend }: { label: string; value: string; tone: 'success' | 'danger' | 'warning' | 'info' | 'primary'; sub?: string; trend?: number }) {
  const tones = { success: 'text-success', danger: 'text-danger', warning: 'text-warning', info: 'text-secondary', primary: 'text-primary' };
  return (
    <div className="card">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-semibold">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className={`text-lg font-bold ${tones[tone]}`}>{value}</span>
        {trend !== undefined && (
          <span className={`text-[10px] font-bold inline-flex items-center gap-0.5 ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
            {trend >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <div className="text-[11px] text-neutral-500 mt-0.5">{sub}</div>}
    </div>
  );
}
