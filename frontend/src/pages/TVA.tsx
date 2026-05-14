import { useState } from 'react';
import { Calendar, Download, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight } from 'lucide-react';

const fmtXOF = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' XOF';

type StatutDeclaration = 'Validée' | 'En cours' | 'À déposer' | 'En retard';

interface Declaration {
  periode: string;
  tvaCollectee: number;
  tvaDeductible: number;
  solde: number;
  echeance: string;
  statut: StatutDeclaration;
  ref?: string;
}

const declarations: Declaration[] = [
  { periode: 'Avril 2026', tvaCollectee: 1924000, tvaDeductible: 298000, solde: 1626000, echeance: '20/05/2026', statut: 'À déposer', },
  { periode: 'Mars 2026', tvaCollectee: 2108000, tvaDeductible: 342000, solde: 1766000, echeance: '20/04/2026', statut: 'Validée', ref: 'DGI-2026-0341' },
  { periode: 'Février 2026', tvaCollectee: 1756000, tvaDeductible: 287000, solde: 1469000, echeance: '20/03/2026', statut: 'Validée', ref: 'DGI-2026-0278' },
  { periode: 'Janvier 2026', tvaCollectee: 1642000, tvaDeductible: 261000, solde: 1381000, echeance: '20/02/2026', statut: 'Validée', ref: 'DGI-2026-0198' },
  { periode: 'Décembre 2025', tvaCollectee: 2340000, tvaDeductible: 412000, solde: 1928000, echeance: '20/01/2026', statut: 'Validée', ref: 'DGI-2025-0841' },
];

const statutCfg: Record<StatutDeclaration, { cls: string; icon: React.ReactNode }> = {
  'Validée':   { cls: 'badge-green', icon: <CheckCircle size={10} /> },
  'En cours':  { cls: 'badge-blue', icon: <Clock size={10} /> },
  'À déposer': { cls: 'badge-orange', icon: <AlertTriangle size={10} /> },
  'En retard': { cls: 'badge-red', icon: <AlertTriangle size={10} /> },
};

// TVA collectée par secteur — mois courant
const tvaParSecteur = [
  { secteur: 'Ventes de services', base: 8960000, tva: 1612800 },
  { secteur: 'Ventes de biens', base: 1730000, tva: 311400 },
  { secteur: 'Prestations diverses', base: 0, tva: 0 },
];

const tvaDeductibleDetail = [
  { nature: 'Achats fournisseurs locaux', base: 1320000, tva: 237600 },
  { nature: 'Importations taxables', base: 0, tva: 0 },
  { nature: 'Frais généraux', base: 335500, tva: 60390 },
];

const TAUX_TVA = 18;

export default function TVA() {
  const [tab, setTab] = useState<'declaration' | 'historique' | 'calendrier'>('declaration');

  const totalCollectee = tvaParSecteur.reduce((s, r) => s + r.tva, 0);
  const totalDeductible = tvaDeductibleDetail.reduce((s, r) => s + r.tva, 0);
  const soldeNet = totalCollectee - totalDeductible;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">TVA & Déclarations fiscales</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Gestion de la TVA — Taux standard Sénégal : {TAUX_TVA}%</p>
        </div>
        <div className="flex gap-2">
          <button className="btn border border-neutral-200 text-neutral-600 bg-white flex items-center gap-1.5 text-sm">
            <Download size={14} /> Exporter DGI
          </button>
          <button className="btn btn-primary flex items-center gap-1.5 text-sm">
            <FileText size={14} /> Valider la déclaration
          </button>
        </div>
      </div>

      {/* Alerte déclaration */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
        <div>
          <span className="text-sm font-semibold text-amber-800">Déclaration Avril 2026 à déposer</span>
          <span className="text-sm text-amber-700"> — Échéance : 20/05/2026 (dans 7 jours)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white rounded-xl shadow-card w-fit">
        {[
          { id: 'declaration', label: 'Déclaration courante' },
          { id: 'historique', label: 'Historique' },
          { id: 'calendrier', label: 'Calendrier fiscal' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-primary text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* DÉCLARATION COURANTE */}
      {tab === 'declaration' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <div className="text-xs text-neutral-400 mb-1">TVA collectée (Avril)</div>
              <div className="text-2xl font-bold text-blue-600">{fmtXOF(totalCollectee)}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs text-neutral-400 mb-1">TVA déductible</div>
              <div className="text-2xl font-bold text-green-600">({fmtXOF(totalDeductible)})</div>
            </div>
            <div className="card text-center bg-primary text-white">
              <div className="text-xs text-white/70 mb-1">TVA nette à décaisser</div>
              <div className="text-2xl font-bold">{fmtXOF(soldeNet)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* TVA collectée */}
            <div className="card">
              <h3 className="text-sm font-bold text-neutral-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />TVA collectée — Avril 2026
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                    <th className="text-left pb-2">Secteur</th>
                    <th className="text-right pb-2">Base HT</th>
                    <th className="text-right pb-2">TVA ({TAUX_TVA}%)</th>
                  </tr>
                </thead>
                <tbody>
                  {tvaParSecteur.map(r => (
                    <tr key={r.secteur} className="border-t border-neutral-50">
                      <td className="py-2 text-neutral-700">{r.secteur}</td>
                      <td className="py-2 text-right text-neutral-500">{r.base > 0 ? fmtXOF(r.base) : '—'}</td>
                      <td className="py-2 text-right font-semibold text-blue-600">{r.tva > 0 ? fmtXOF(r.tva) : '—'}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-neutral-200 bg-blue-50">
                    <td className="py-2 font-bold text-blue-700">TOTAL</td>
                    <td className="py-2 text-right font-bold">{fmtXOF(tvaParSecteur.reduce((s, r) => s + r.base, 0))}</td>
                    <td className="py-2 text-right font-bold text-blue-700">{fmtXOF(totalCollectee)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TVA déductible */}
            <div className="card">
              <h3 className="text-sm font-bold text-neutral-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />TVA déductible — Avril 2026
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                    <th className="text-left pb-2">Nature</th>
                    <th className="text-right pb-2">Base HT</th>
                    <th className="text-right pb-2">TVA récupérable</th>
                  </tr>
                </thead>
                <tbody>
                  {tvaDeductibleDetail.map(r => (
                    <tr key={r.nature} className="border-t border-neutral-50">
                      <td className="py-2 text-neutral-700">{r.nature}</td>
                      <td className="py-2 text-right text-neutral-500">{r.base > 0 ? fmtXOF(r.base) : '—'}</td>
                      <td className="py-2 text-right font-semibold text-green-600">{r.tva > 0 ? fmtXOF(r.tva) : '—'}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-neutral-200 bg-green-50">
                    <td className="py-2 font-bold text-green-700">TOTAL</td>
                    <td className="py-2 text-right font-bold">{fmtXOF(tvaDeductibleDetail.reduce((s, r) => s + r.base, 0))}</td>
                    <td className="py-2 text-right font-bold text-green-700">{fmtXOF(totalDeductible)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* HISTORIQUE */}
      {tab === 'historique' && (
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-400 text-xs uppercase tracking-wide border-b border-neutral-100">
                <th className="text-left pb-2">Période</th>
                <th className="text-right pb-2">TVA collectée</th>
                <th className="text-right pb-2">TVA déductible</th>
                <th className="text-right pb-2">Net à décaisser</th>
                <th className="text-center pb-2">Échéance</th>
                <th className="text-left pb-2">Référence DGI</th>
                <th className="text-center pb-2">Statut</th>
                <th className="text-center pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {declarations.map(d => {
                const cfg = statutCfg[d.statut];
                return (
                  <tr key={d.periode} className="border-t border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="py-2.5 font-medium text-neutral-800">{d.periode}</td>
                    <td className="py-2.5 text-right text-blue-600">{fmtXOF(d.tvaCollectee)}</td>
                    <td className="py-2.5 text-right text-green-600">({fmtXOF(d.tvaDeductible)})</td>
                    <td className="py-2.5 text-right font-bold text-neutral-800">{fmtXOF(d.solde)}</td>
                    <td className="py-2.5 text-center text-xs text-neutral-500">{d.echeance}</td>
                    <td className="py-2.5 text-xs text-neutral-500 font-mono">{d.ref ?? '—'}</td>
                    <td className="py-2.5 text-center">
                      <span className={`badge flex items-center gap-1 justify-center w-fit mx-auto ${cfg.cls}`}>
                        {cfg.icon}{d.statut}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <button className="text-[10px] px-2 py-1 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 font-medium flex items-center gap-1 mx-auto">
                        <Download size={9} /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CALENDRIER FISCAL */}
      {tab === 'calendrier' && (
        <div className="space-y-3">
          {[
            { date: '20/05/2026', type: 'TVA', desc: 'Déclaration TVA — Avril 2026', urgent: true },
            { date: '15/06/2026', type: 'IS', desc: 'Acompte IS 2ème trimestre', urgent: false },
            { date: '20/06/2026', type: 'TVA', desc: 'Déclaration TVA — Mai 2026', urgent: false },
            { date: '30/06/2026', type: 'CFCE', desc: 'Contribution forfaitaire à la charge des employeurs', urgent: false },
            { date: '20/07/2026', type: 'TVA', desc: 'Déclaration TVA — Juin 2026', urgent: false },
            { date: '31/07/2026', type: 'IRPP', desc: 'Déclaration annuelle IRPP personnel', urgent: false },
          ].map(e => (
            <div key={e.date + e.type} className={`flex items-center gap-4 p-4 rounded-xl border ${e.urgent ? 'bg-amber-50 border-amber-200' : 'bg-white border-neutral-100 shadow-card'}`}>
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${e.urgent ? 'bg-amber-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                <Calendar size={14} />
                <span className="text-[10px] font-bold mt-0.5">{e.date.split('/')[0]}/{e.date.split('/')[1]}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-neutral-800">{e.desc}</div>
                <div className="text-xs text-neutral-500 mt-0.5">Échéance : {e.date}</div>
              </div>
              <span className={`badge ${e.type === 'TVA' ? 'badge-blue' : e.type === 'IS' ? 'badge-purple' : 'badge-orange'}`}>{e.type}</span>
              {e.urgent && <span className="badge badge-orange">Urgent</span>}
              <ChevronRight size={14} className="text-neutral-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
