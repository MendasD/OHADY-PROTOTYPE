import { useState } from 'react';
import {
  UploadCloud, Sparkles, CheckCircle, AlertTriangle, FileText, Eye,
  ArrowRight, RefreshCw, ChevronRight, Send,
} from 'lucide-react';
import { fmt, fmtXOF } from '../data/mockData';

type DocStatut = 'ocr_pending' | 'ocr_done' | 'a_valider' | 'valide' | 'rejete';

interface DocFournisseur {
  id: string;
  filename: string;
  fournisseur: string;
  numero: string;
  date: string;
  montantHT: number;
  tva: number;
  ttc: number;
  echeance: string;
  statut: DocStatut;
  confidence: number;
  uploaded: string;
  preview?: string;
  warnings?: string[];
}

const docs: DocFournisseur[] = [
  { id: 'd1', filename: 'facture_COGEMATEC_1247.pdf', fournisseur: 'COGEMATEC SARL',  numero: 'COGE-2026-1247', date: '12/05/2026', montantHT: 1_800_000, tva: 324_000, ttc: 2_124_000, echeance: '12/06/2026', statut: 'a_valider', confidence: 97, uploaded: '13/05 09:14' },
  { id: 'd2', filename: 'facture_SETUMA_034.pdf',     fournisseur: 'SETUMA',           numero: 'SET-2026-0034',  date: '05/05/2026', montantHT:   920_000, tva: 165_600, ttc: 1_085_600, echeance: '05/06/2026', statut: 'a_valider', confidence: 94, uploaded: '13/05 08:52' },
  { id: 'd3', filename: 'recu_carbone.jpg',           fournisseur: 'Station Carbone',  numero: 'TKT-589321',     date: '13/05/2026', montantHT:    18_500, tva:   3_330, ttc:    21_830, echeance: 'Comptant', statut: 'ocr_done', confidence: 78, uploaded: '13/05 14:32', warnings: ['Pas de NINEA détecté'] },
  { id: 'd4', filename: 'fact_SENELEC_avril.pdf',     fournisseur: 'SENELEC',          numero: 'SEN-2026-04421', date: '02/05/2026', montantHT:    34_500, tva:   6_210, ttc:    40_710, echeance: '15/06/2026', statut: 'valide', confidence: 99, uploaded: '06/05 11:08' },
  { id: 'd5', filename: 'facture_inconnu.pdf',         fournisseur: 'Non détecté',     numero: '—',              date: '—',           montantHT: 0, tva: 0, ttc: 0, echeance: '—', statut: 'ocr_pending', confidence: 0, uploaded: '14/05 07:45' },
  { id: 'd6', filename: 'fact_INDUSTRIE_089.pdf',     fournisseur: 'INDUSTRIE 2000',   numero: 'IND-2026-0089',  date: '10/04/2026', montantHT: 1_250_000, tva: 225_000, ttc: 1_475_000, echeance: '10/05/2026', statut: 'valide', confidence: 98, uploaded: '11/04 09:22' },
  { id: 'd7', filename: 'note_frais_camara.pdf',       fournisseur: 'Carrefour Dakar', numero: 'TKT-9842',       date: '08/05/2026', montantHT:   125_000, tva:  22_500, ttc:   147_500, echeance: 'Comptant', statut: 'rejete', confidence: 65, uploaded: '09/05 16:42', warnings: ['Justificatif illisible', 'Demande de re-scan'] },
];

const statutMeta: Record<DocStatut, { label: string; cls: string; color: string }> = {
  ocr_pending: { label: 'OCR en cours',     cls: 'badge-gray',   color: '#94A3B8' },
  ocr_done:    { label: 'Extraction faite', cls: 'badge-blue',   color: '#2980B9' },
  a_valider:   { label: 'À valider',         cls: 'badge-orange', color: '#F39C12' },
  valide:      { label: 'Validée',           cls: 'badge-green',  color: '#27AE60' },
  rejete:      { label: 'Rejetée',           cls: 'badge-red',    color: '#E74C3C' },
};

export default function AchatsInbox() {
  const [activeDoc, setActiveDoc] = useState<DocFournisseur>(docs[0]);
  const [filter, setFilter] = useState<'all' | DocStatut>('all');
  const [dragOver, setDragOver] = useState(false);

  const filtered = filter === 'all' ? docs : docs.filter(d => d.statut === filter);

  const counts = (Object.keys(statutMeta) as DocStatut[]).reduce((acc, s) => {
    acc[s] = docs.filter(d => d.statut === s).length;
    return acc;
  }, {} as Record<DocStatut, number>);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Pile factures fournisseurs</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Drag & drop, OCR automatique, validation comptable en un clic</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><RefreshCw size={12} /> Resync</button>
          <button className="btn btn-primary btn-sm"><UploadCloud size={12} /> Importer</button>
        </div>
      </div>

      {/* Drop zone + KPIs */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4">
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); }}
          className={`rounded-2xl border-2 border-dashed transition-all p-6 flex items-center gap-4 ${
            dragOver ? 'border-secondary bg-secondary/5' : 'border-neutral-200 bg-white'
          }`}
        >
          <div className={`w-14 h-14 rounded-xl grid place-items-center flex-shrink-0 ${dragOver ? 'bg-secondary text-white' : 'bg-neutral-100 text-secondary'}`}>
            <UploadCloud size={22} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-neutral-800">Glissez vos factures fournisseurs ici</div>
            <p className="text-[11px] text-neutral-500 mt-0.5">PDF, JPG, PNG, scan multipage · OCR automatique en moins de 30 secondes</p>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-neutral-400">
              <Sparkles size={10} className="text-purple-500" />
              <span>Détection automatique fournisseur, montants, TVA et n° de facture</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 xl:grid-cols-1 gap-3 xl:gap-2 xl:min-w-[220px]">
          <div className="card !py-3 !px-4">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wide">À valider</div>
            <div className="text-xl font-bold text-warning">{counts.a_valider}</div>
          </div>
          <div className="card !py-3 !px-4">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wide">OCR fait</div>
            <div className="text-xl font-bold text-secondary">{counts.ocr_done}</div>
          </div>
          <div className="card !py-3 !px-4">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wide">En attente</div>
            <div className="text-xl font-bold text-neutral-500">{counts.ocr_pending}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-5">
        {/* Liste des documents */}
        <div className="card !p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-neutral-700">Documents · {filtered.length}</h3>
            <div className="flex items-center gap-1 flex-wrap">
              <FilterChip active={filter === 'all'} count={docs.length} label="Tous" onClick={() => setFilter('all')} />
              {(Object.keys(statutMeta) as DocStatut[]).map(s => (
                <FilterChip
                  key={s}
                  active={filter === s}
                  count={counts[s]}
                  color={statutMeta[s].color}
                  label={statutMeta[s].label}
                  onClick={() => setFilter(s)}
                />
              ))}
            </div>
          </div>
          <div className="divide-y divide-neutral-50 max-h-[640px] overflow-y-auto">
            {filtered.map(d => {
              const meta = statutMeta[d.statut];
              const isActive = activeDoc.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDoc(d)}
                  className={`w-full px-5 py-3 text-left transition-colors flex items-start gap-3 ${
                    isActive ? 'bg-secondary/5 border-l-2 border-secondary' : 'hover:bg-neutral-50/50'
                  }`}
                >
                  <div className="w-10 h-12 rounded-md bg-neutral-100 grid place-items-center flex-shrink-0">
                    <FileText size={14} className="text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-neutral-500 truncate">{d.filename}</span>
                      <span className={`badge ${meta.cls} text-[10px]`}>{meta.label}</span>
                    </div>
                    <div className="text-sm font-semibold text-neutral-800 mt-0.5 truncate">{d.fournisseur}</div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500">
                      <span className="font-mono">{d.numero}</span>
                      <span>·</span>
                      <span>{d.date}</span>
                      {d.confidence > 0 && (
                        <>
                          <span>·</span>
                          <span className={d.confidence >= 90 ? 'text-success font-bold' : d.confidence >= 75 ? 'text-secondary' : 'text-warning'}>
                            {d.confidence}% conf.
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {d.ttc > 0 && <div className="text-sm font-mono font-bold text-neutral-800">{fmt(d.ttc)}</div>}
                    <div className="text-[10px] text-neutral-400">{d.uploaded}</div>
                  </div>
                  <ChevronRight size={13} className={`text-neutral-300 ${isActive ? 'text-secondary' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Détail OCR */}
        <div className="space-y-4">
          {/* Aperçu */}
          <div className="card !p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-700">Aperçu</h3>
              <button className="btn btn-outline btn-sm"><Eye size={11} /> Plein écran</button>
            </div>
            <div className="aspect-[3/4] bg-gradient-to-br from-neutral-100 to-neutral-50 grid place-items-center text-neutral-400 p-6">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-2" />
                <div className="text-xs font-mono">{activeDoc.filename}</div>
                <div className="text-[10px] mt-1">Aperçu PDF / image</div>
              </div>
            </div>
          </div>

          {/* Extraction IA */}
          <div className="card !p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between bg-purple-50/30">
              <h3 className="text-sm font-bold text-purple-700 flex items-center gap-2">
                <Sparkles size={13} /> Données extraites par l'IA
              </h3>
              <span className="text-[11px] text-purple-600 font-semibold">{activeDoc.confidence}% confiance</span>
            </div>
            <div className="p-4 space-y-2.5">
              <Field label="Fournisseur" value={activeDoc.fournisseur} />
              <Field label="N° facture" value={activeDoc.numero} mono />
              <Field label="Date facture" value={activeDoc.date} />
              <Field label="Échéance" value={activeDoc.echeance} />
              <Field label="Montant HT" value={fmtXOF(activeDoc.montantHT)} mono />
              <Field label="TVA 18 %" value={fmtXOF(activeDoc.tva)} mono />
              <Field label="Total TTC" value={fmtXOF(activeDoc.ttc)} mono highlight />
            </div>

            {activeDoc.warnings && (
              <div className="px-4 py-3 border-t border-neutral-100 bg-orange-50/30">
                <div className="flex items-start gap-2 text-[11px] text-warning">
                  <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />
                  <ul className="space-y-0.5">
                    {activeDoc.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {/* Écriture proposée */}
            {activeDoc.statut === 'a_valider' && (
              <div className="px-4 py-3 border-t border-neutral-100 bg-blue-50/30">
                <div className="text-[10px] uppercase tracking-wide text-secondary font-bold mb-2 flex items-center gap-1">
                  <Sparkles size={10} /> Écriture proposée
                </div>
                <ul className="text-[11px] font-mono space-y-0.5">
                  <li className="flex items-center gap-1.5"><span className="text-success font-bold">D</span> 60100 — Achats marchandises <span className="ml-auto">{fmt(activeDoc.montantHT)}</span></li>
                  <li className="flex items-center gap-1.5"><span className="text-success font-bold">D</span> 44510 — TVA déductible <span className="ml-auto">{fmt(activeDoc.tva)}</span></li>
                  <li className="flex items-center gap-1.5"><span className="text-danger font-bold">C</span> 40100 — Fournisseur <span className="ml-auto">{fmt(activeDoc.ttc)}</span></li>
                </ul>
              </div>
            )}

            <div className="px-4 py-3 border-t border-neutral-100 flex items-center gap-2">
              {activeDoc.statut === 'a_valider' && (
                <>
                  <button className="btn btn-outline btn-sm flex-1 justify-center"><FileText size={11} /> Modifier</button>
                  <button className="btn btn-primary btn-sm flex-1 justify-center"><CheckCircle size={11} /> Valider</button>
                </>
              )}
              {activeDoc.statut === 'ocr_done' && (
                <button className="btn btn-primary btn-sm w-full justify-center"><Send size={11} /> Envoyer à validation</button>
              )}
              {activeDoc.statut === 'valide' && (
                <button className="btn btn-outline btn-sm w-full justify-center"><Eye size={11} /> Voir l'écriture validée <ArrowRight size={11} /></button>
              )}
              {activeDoc.statut === 'rejete' && (
                <button className="btn btn-outline btn-sm w-full justify-center"><RefreshCw size={11} /> Re-traiter</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${highlight ? 'pt-2 border-t border-neutral-100' : ''}`}>
      <span className="text-[11px] text-neutral-500 font-medium">{label}</span>
      <span className={`text-xs font-medium ${mono ? 'font-mono' : ''} ${highlight ? 'text-base font-bold text-primary' : 'text-neutral-800'}`}>{value}</span>
    </div>
  );
}

function FilterChip({ label, count, color, active, onClick }: { label: string; count: number; color?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] transition-all ${
        active
          ? 'border-secondary bg-secondary/10 text-secondary font-semibold'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
      }`}
    >
      {color && <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
      {label} <span className="font-mono text-neutral-500">({count})</span>
    </button>
  );
}
