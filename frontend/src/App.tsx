import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Tresorerie from './pages/Tresorerie';
import VentesClients from './pages/VentesClients';
import AchatsDepenses from './pages/AchatsDepenses';
import Comptabilite from './pages/Comptabilite';
import Intelligence from './pages/Intelligence';
import Administration from './pages/Administration';
import RH from './pages/RH';
import Caisse from './pages/Caisse';
import PlanComptable from './pages/PlanComptable';
import Stocks from './pages/Stocks';
import Immobilisations from './pages/Immobilisations';
import Modelisation from './pages/Modelisation';
import EtatsFinanciers from './pages/EtatsFinanciers';
import Devis from './pages/Devis';
import Relances from './pages/Relances';
import BonsCommande from './pages/BonsCommande';
import Fournisseurs from './pages/Fournisseurs';
import Avances from './pages/Avances';
import Suspens from './pages/Suspens';
import TVA from './pages/TVA';
import Audit from './pages/Audit';
import Integrations from './pages/Integrations';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-lg font-semibold text-neutral-700">{title}</h2>
      <p className="text-neutral-400 mt-1.5 text-sm max-w-xs mx-auto">
        Ce module sera disponible dans une prochaine itération du prototype.
      </p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Pilotage */}
          <Route path="dashboard"        element={<Dashboard />} />
          <Route path="budget"           element={<Budget />} />
          <Route path="modelisation"     element={<Modelisation />} />
          <Route path="etats-financiers" element={<EtatsFinanciers />} />

          {/* Trésorerie */}
          <Route path="tresorerie"       element={<Tresorerie />} />
          <Route path="rapprochement"    element={<Tresorerie />} />
          <Route path="prevision"        element={<Tresorerie />} />
          <Route path="caisse"           element={<Caisse />} />

          {/* Ventes & Clients */}
          <Route path="ventes"           element={<VentesClients />} />
          <Route path="devis"            element={<Devis />} />
          <Route path="recouvrement"     element={<VentesClients />} />
          <Route path="relances"         element={<Relances />} />

          {/* Achats & Dépenses */}
          <Route path="achats"           element={<AchatsDepenses />} />
          <Route path="bons-commande"    element={<BonsCommande />} />
          <Route path="fournisseurs"     element={<Fournisseurs />} />
          <Route path="avances"          element={<Avances />} />

          {/* Comptabilité */}
          <Route path="comptabilite"     element={<Comptabilite />} />
          <Route path="plan-comptable"   element={<PlanComptable />} />
          <Route path="cloture"          element={<Placeholder title="Clôture mensuelle" />} />
          <Route path="suspens"          element={<Suspens />} />
          <Route path="tva"              element={<TVA />} />

          {/* RH & Paie */}
          <Route path="employes"         element={<RH />} />
          <Route path="paie"             element={<RH />} />
          <Route path="conges"           element={<RH />} />
          <Route path="avances-rh"       element={<RH />} />

          {/* Stocks & Immobilisations */}
          <Route path="articles"         element={<Stocks />} />
          <Route path="mouvements"       element={<Stocks />} />
          <Route path="inventaire"       element={<Stocks />} />
          <Route path="immobilisations"  element={<Immobilisations />} />
          <Route path="amortissements"   element={<Immobilisations />} />

          {/* Intelligence IA */}
          <Route path="intelligence"     element={<Intelligence />} />
          <Route path="ocr"              element={<Intelligence />} />
          <Route path="anomalies"        element={<Intelligence />} />

          {/* Administration */}
          <Route path="administration"   element={<Administration />} />
          <Route path="utilisateurs"     element={<Administration />} />
          <Route path="securite"         element={<Administration />} />
          <Route path="audit"            element={<Audit />} />
          <Route path="integrations"     element={<Integrations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
