import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Rapprochement from './pages/Rapprochement';
import Prevision from './pages/Prevision';
import Recouvrement from './pages/Recouvrement';
import Saisie from './pages/Saisie';
import GrandLivre from './pages/GrandLivre';
import Balance from './pages/Balance';
import Lettrage from './pages/Lettrage';
import Retenues from './pages/Retenues';
import Declarations from './pages/Declarations';
import FactElec from './pages/FactElec';
import ClotureMensuelle from './pages/ClotureMensuelle';
import ClotureAnnuelle from './pages/ClotureAnnuelle';
import Liasses from './pages/Liasses';
import Catalogue from './pages/Catalogue';
import AchatsInbox from './pages/AchatsInbox';
import FicheTier from './pages/FicheTier';
import Analytique from './pages/Analytique';
import PilotageTDB from './pages/PilotageTDB';
import Parametres from './pages/Parametres';
import Cheques from './pages/Cheques';
import PortailEC from './pages/PortailEC';
import Consolidation from './pages/Consolidation';
import Migration from './pages/Migration';
import FluxTresorerie from './pages/FluxTresorerie';
import PlanEncaissement from './pages/PlanEncaissement';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Pilotage */}
          <Route path="dashboard"        element={<Dashboard />} />
          <Route path="budget"           element={<Budget />} />
          <Route path="analytique"       element={<Analytique />} />
          <Route path="modelisation"     element={<Modelisation />} />
          <Route path="consolidation"    element={<Consolidation />} />
          <Route path="portail-ec"       element={<PortailEC />} />
          <Route path="pilotage"         element={<PilotageTDB />} />

          {/* Comptabilité */}
          <Route path="saisie"           element={<Saisie />} />
          <Route path="comptabilite"     element={<Comptabilite />} />
          <Route path="grand-livre"      element={<GrandLivre />} />
          <Route path="balance"          element={<Balance />} />
          <Route path="lettrage"         element={<Lettrage />} />
          <Route path="plan-comptable"   element={<PlanComptable />} />
          <Route path="suspens"          element={<Suspens />} />

          {/* Trésorerie */}
          <Route path="tresorerie"       element={<Tresorerie />} />
          <Route path="rapprochement"    element={<Rapprochement />} />
          <Route path="cheques"          element={<Cheques />} />
          <Route path="prevision"        element={<Prevision />} />
          <Route path="caisse"           element={<Caisse />} />

          {/* Ventes */}
          <Route path="ventes"           element={<VentesClients />} />
          <Route path="devis"            element={<Devis />} />
          <Route path="recouvrement"     element={<Recouvrement />} />
          <Route path="plans-encaissement" element={<PlanEncaissement />} />
          <Route path="catalogue"        element={<Catalogue />} />
          <Route path="relances"         element={<Relances />} />

          {/* Achats */}
          <Route path="achats-inbox"     element={<AchatsInbox />} />
          <Route path="fournisseurs"     element={<Fournisseurs />} />
          <Route path="bons-commande"    element={<BonsCommande />} />
          <Route path="achats"           element={<AchatsDepenses />} />
          <Route path="avances"          element={<Avances />} />

          {/* RH & Tiers */}
          <Route path="employes"         element={<RH />} />
          <Route path="paie"             element={<RH />} />
          <Route path="conges"           element={<RH />} />
          <Route path="avances-rh"       element={<RH />} />
          <Route path="tiers"            element={<FicheTier />} />

          {/* Stocks & Immo */}
          <Route path="articles"         element={<Stocks />} />
          <Route path="mouvements"       element={<Stocks />} />
          <Route path="inventaire"       element={<Stocks />} />
          <Route path="immobilisations"  element={<Immobilisations />} />
          <Route path="amortissements"   element={<Immobilisations />} />

          {/* Fiscal */}
          <Route path="tva"              element={<TVA />} />
          <Route path="retenues"         element={<Retenues />} />
          <Route path="declarations"     element={<Declarations />} />
          <Route path="fact-elec"        element={<FactElec />} />

          {/* Clôture */}
          <Route path="cloture-m"        element={<ClotureMensuelle />} />
          <Route path="cloture-a"        element={<ClotureAnnuelle />} />
          <Route path="etats-financiers" element={<EtatsFinanciers />} />
          <Route path="flux-tresorerie"  element={<FluxTresorerie />} />
          <Route path="liasses"          element={<Liasses />} />

          {/* Intelligence IA */}
          <Route path="intelligence"     element={<Intelligence />} />
          <Route path="ocr"              element={<Intelligence />} />
          <Route path="anomalies"        element={<Intelligence />} />

          {/* Paramètres */}
          <Route path="parametres"       element={<Parametres />} />
          <Route path="administration"   element={<Administration />} />
          <Route path="utilisateurs"     element={<Administration />} />
          <Route path="securite"         element={<Administration />} />
          <Route path="audit"            element={<Audit />} />
          <Route path="integrations"     element={<Integrations />} />
          <Route path="migration"        element={<Migration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
