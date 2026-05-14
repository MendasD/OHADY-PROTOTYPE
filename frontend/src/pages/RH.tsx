import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Users, DollarSign, Calendar, Plus, Search, Download,
  CheckCircle, AlertCircle, Eye, Edit,
} from 'lucide-react';
import { fmtXOF } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const pathToTab: Record<string, string> = {
  '/employes': 'employes',
  '/paie': 'paie',
  '/conges': 'conges',
  '/avances-rh': 'avances',
};
const tabToPath: Record<string, string> = Object.fromEntries(
  Object.entries(pathToTab).map(([p, t]) => [t, p]),
);

const employees = [
  { id: 'e1', nom: 'Aminata Diallo',   poste: 'Comptable junior',   dept: 'Finance',     salaire: 450000,  anciennete: '2 ans',    statut: 'CDI',  conges: 12, absences: 1, avance: 0       },
  { id: 'e2', nom: 'Fatou Ndiaye',     poste: 'Comptable junior',   dept: 'Finance',     salaire: 420000,  anciennete: '1 an',     statut: 'CDI',  conges: 15, absences: 0, avance: 0       },
  { id: 'e3', nom: 'Oumar Seck',       poste: 'Chef Comptable',     dept: 'Finance',     salaire: 850000,  anciennete: '5 ans',    statut: 'CDI',  conges: 8,  absences: 0, avance: 200000  },
  { id: 'e4', nom: 'Ibrahima Touré',   poste: 'Trésorier',          dept: 'Finance',     salaire: 720000,  anciennete: '3 ans',    statut: 'CDI',  conges: 10, absences: 2, avance: 320000  },
  { id: 'e5', nom: 'Moussa Camara',    poste: 'Comptable senior',   dept: 'Finance',     salaire: 650000,  anciennete: '4 ans',    statut: 'CDI',  conges: 5,  absences: 0, avance: 0       },
  { id: 'e6', nom: 'Rokhaya Dieng',    poste: 'Assistante RH',      dept: 'RH',          salaire: 380000,  anciennete: '1 an',     statut: 'CDD',  conges: 18, absences: 0, avance: 0       },
  { id: 'e7', nom: 'Aïssatou Barry',   poste: 'Commercial',         dept: 'Commercial',  salaire: 480000,  anciennete: '2 ans',    statut: 'CDI',  conges: 12, absences: 3, avance: 0       },
  { id: 'e8', nom: 'Cheikh Diop',      poste: 'Développeur',        dept: 'IT',          salaire: 900000,  anciennete: '3 ans',    statut: 'CDI',  conges: 20, absences: 0, avance: 0       },
];

const payrollData = [
  { mois: 'Jan', brut: 5230000, charges: 680000, net: 4550000 },
  { mois: 'Fév', brut: 5230000, charges: 680000, net: 4550000 },
  { mois: 'Mar', brut: 5430000, charges: 705000, net: 4725000 },
  { mois: 'Avr', brut: 5430000, charges: 705000, net: 4725000 },
  { mois: 'Mai', brut: 5850000, charges: 760000, net: 5090000 },
];

const tabs = ['employes', 'paie', 'conges', 'avances'];
const tabLabels: Record<string, string> = { employes: 'Employés', paie: 'Paie & Bulletins', conges: 'Congés & Absences', avances: 'Avances sur salaire' };

export default function RH() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(pathToTab[pathname] ?? 'employes');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = pathToTab[pathname];
    if (t && t !== activeTab) setActiveTab(t);
  }, [pathname, activeTab]);

  const changeTab = (t: string) => {
    setActiveTab(t);
    const targetPath = tabToPath[t];
    if (targetPath && targetPath !== pathname) navigate(targetPath);
  };

  const filtered = employees.filter(e =>
    e.nom.toLowerCase().includes(search.toLowerCase()) ||
    e.poste.toLowerCase().includes(search.toLowerCase())
  );

  const totalBrut = employees.reduce((s, e) => s + e.salaire, 0);
  const totalAvances = employees.reduce((s, e) => s + e.avance, 0);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">RH & Paie</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{employees.length} employés · Mai 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm"><Download size={13} /> Exporter</button>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Nouvel employé</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Effectif total',         value: employees.length, unit: 'employés', color: 'text-secondary', Icon: Users },
          { label: 'Masse salariale brute',  value: fmtXOF(totalBrut), unit: 'XOF/mois', color: 'text-neutral-800', Icon: DollarSign },
          { label: 'Avances en cours',       value: fmtXOF(totalAvances), unit: '2 employés', color: 'text-orange-500', Icon: AlertCircle },
          { label: 'Congés planifiés (mai)', value: 3, unit: 'employés absents', color: 'text-success', Icon: Calendar },
        ].map(item => (
          <div key={item.label} className="card">
            <div className="flex items-center gap-2 mb-2">
              <item.Icon size={16} className={item.color} />
              <span className="text-xs text-neutral-500">{item.unit}</span>
            </div>
            <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-neutral-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button key={tab} onClick={() => changeTab(tab)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-0 ${activeTab === tab ? 'bg-white text-neutral-800 shadow-card' : 'text-neutral-500 hover:text-neutral-700 bg-transparent'}`}>
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Employés */}
      {activeTab === 'employes' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Registre du personnel</h2>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="input pl-8 py-1.5 text-xs w-52" placeholder="Nom, poste..." />
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr>
                <th>Employé</th><th>Poste</th><th>Département</th>
                <th>Contrat</th><th className="text-right">Salaire brut</th>
                <th>Congés restants</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: `hsl(${emp.nom.charCodeAt(0) * 7 % 360}, 60%, 50%)` }}>
                          {emp.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-800 text-xs">{emp.nom}</div>
                          <div className="text-[10px] text-neutral-400">{emp.anciennete}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs">{emp.poste}</td>
                    <td><span className="badge badge-gray text-[10px]">{emp.dept}</span></td>
                    <td>
                      <span className={`badge text-[10px] ${emp.statut === 'CDI' ? 'badge-green' : 'badge-orange'}`}>{emp.statut}</span>
                    </td>
                    <td className="text-right font-semibold text-neutral-800">{fmtXOF(emp.salaire)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full">
                          <div className="h-full bg-secondary rounded-full" style={{ width: `${(emp.conges / 30) * 100}%` }} />
                        </div>
                        <span className="text-xs text-neutral-600 font-medium w-12">{emp.conges}j</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-sm py-1 px-2"><Eye size={11} /></button>
                        <button className="btn btn-ghost btn-sm py-1 px-2"><Edit size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paie */}
      {activeTab === 'paie' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="card xl:col-span-2">
            <h2 className="section-title mb-4">Évolution de la masse salariale</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={payrollData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: any) => fmtXOF(Number(v))} />
                <Bar dataKey="brut" name="Brut" fill="#2980B9" radius={[3,3,0,0]} maxBarSize={28} />
                <Bar dataKey="net"  name="Net"  fill="#27AE60" radius={[3,3,0,0]} maxBarSize={28} />
                <Bar dataKey="charges" name="Charges patronales" fill="#F39C12" radius={[3,3,0,0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="section-title mb-4">Paie mai 2026</h2>
            <div className="space-y-3">
              {[
                { label: 'Brut total',          value: fmtXOF(5850000), color: 'text-neutral-800' },
                { label: 'IPRES (8.4%)',         value: `-${fmtXOF(491400)}`, color: 'text-danger' },
                { label: 'IR (retenue source)',  value: `-${fmtXOF(268600)}`, color: 'text-danger' },
                { label: 'Net à payer',          value: fmtXOF(5090000), color: 'text-success font-bold text-lg' },
                { label: 'Charges patronales',   value: fmtXOF(760000),  color: 'text-orange-500' },
                { label: 'Coût total employeur', value: fmtXOF(6610000), color: 'text-secondary font-bold' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0">
                  <span className="text-xs text-neutral-500">{item.label}</span>
                  <span className={`text-sm ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 btn btn-primary btn-sm">Valider & Virer les salaires</button>
          </div>
        </div>
      )}

      {/* Congés */}
      {activeTab === 'conges' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Suivi des congés — Mai 2026</h2>
            <button className="btn btn-primary btn-sm"><Plus size={13} /> Nouvelle demande</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr>
                <th>Employé</th><th>Type</th><th>Du</th><th>Au</th><th>Jours</th><th>Solde restant</th><th>Statut</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {[
                  { nom: 'A. Diallo',   type: 'Congé annuel', du: '20/05/2026', au: '27/05/2026', jours: 8,  solde: 12, statut: 'approved' },
                  { nom: 'R. Dieng',    type: 'Congé maladie',du: '12/05/2026', au: '14/05/2026', jours: 3,  solde: 18, statut: 'validated' },
                  { nom: 'A. Barry',    type: 'Absence',      du: '05/05/2026', au: '05/05/2026', jours: 1,  solde: 12, statut: 'validated' },
                  { nom: 'O. Seck',     type: 'Congé annuel', du: '01/06/2026', au: '15/06/2026', jours: 15, solde: 8,  statut: 'pending' },
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="font-medium">{item.nom}</td>
                    <td><span className="badge badge-blue text-[10px]">{item.type}</span></td>
                    <td className="text-neutral-500">{item.du}</td>
                    <td className="text-neutral-500">{item.au}</td>
                    <td className="font-bold text-secondary">{item.jours}j</td>
                    <td className="text-neutral-700">{item.solde}j restants</td>
                    <td>
                      <span className={`badge text-[10px] ${item.statut === 'approved' ? 'badge-green' : item.statut === 'validated' ? 'badge-blue' : 'badge-yellow'}`}>
                        {item.statut === 'approved' ? 'Approuvé' : item.statut === 'validated' ? 'Validé' : 'En attente'}
                      </span>
                    </td>
                    <td><button className="btn btn-ghost btn-sm py-1 px-2"><Eye size={11} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Avances */}
      {activeTab === 'avances' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Avances sur salaire en cours</h2>
            <button className="btn btn-primary btn-sm"><Plus size={13} /> Nouvelle avance</button>
          </div>
          <div className="space-y-3">
            {employees.filter(e => e.avance > 0).map(emp => (
              <div key={emp.id} className="flex items-center gap-4 p-4 rounded-xl border border-orange-100 bg-orange-50">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: '#E67E22' }}>
                  {emp.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-neutral-800">{emp.nom}</div>
                  <div className="text-xs text-neutral-500">{emp.poste} · Salaire : {fmtXOF(emp.salaire)}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-orange-600">{fmtXOF(emp.avance)}</div>
                  <div className="text-[10px] text-neutral-500">Avance en cours</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-500">Retenue sur</div>
                  <div className="text-xs font-semibold text-neutral-700">Juin 2026</div>
                </div>
                <button className="btn btn-outline btn-sm border-orange-200"><CheckCircle size={11} /> Solder</button>
              </div>
            ))}
            <div className="text-center py-4 text-xs text-neutral-400">
              Délai maximum d'avance : 3 mois de salaire · Limite : {fmtXOF(employees[0].salaire * 3)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
