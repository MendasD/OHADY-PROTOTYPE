import { createContext, useContext, useState, type ReactNode } from 'react';

export type PersonaId = 'awa' | 'doudou' | 'hermann' | 'elis' | 'issa';

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  shortRole: string;
  initials: string;
  color: string;
  scope: 'interne' | 'externe';
  description: string;
  /** Liste des module IDs prioritaires affichés en raccourcis dashboard */
  primaryModules: string[];
  /** KPI prioritaires sur le dashboard (clé interne) */
  primaryKpis: string[];
  /** Couleur secondaire pour bandes de hero */
  accent: string;
}

export const PERSONAS: Persona[] = [
  {
    id: 'hermann',
    name: 'Hermann Cakpo',
    role: 'DAF — Directeur Financier',
    shortRole: 'DAF',
    initials: 'HC',
    color: '#E67E22',
    accent: '#F39C12',
    scope: 'interne',
    description: 'Vision pilotage : trésorerie, budget, projection sur 5 ans, alertes business.',
    primaryModules: ['pilotage', 'tresorerie', 'cloture'],
    primaryKpis: ['ca', 'tresorerie', 'resultat', 'budget'],
  },
  {
    id: 'elis',
    name: 'Elis Kouakou',
    role: 'Finance & Modélisation',
    shortRole: 'Finance',
    initials: 'EK',
    color: '#9B59B6',
    accent: '#A78BFA',
    scope: 'interne',
    description: 'Modélisation, scénarios, budgets, ratios, analytique multi-axes.',
    primaryModules: ['pilotage', 'cloture', 'comptabilite'],
    primaryKpis: ['ca', 'marge', 'ebitda', 'scenarios'],
  },
  {
    id: 'doudou',
    name: 'Doudou Sow',
    role: 'Chef comptable',
    shortRole: 'Chef compta',
    initials: 'DS',
    color: '#2980B9',
    accent: '#3498DB',
    scope: 'interne',
    description: 'Contrôle, validation, clôture, supervision junior, anomalies.',
    primaryModules: ['comptabilite', 'cloture', 'fiscal'],
    primaryKpis: ['ecritures', 'anomalies', 'suspens', 'cloture'],
  },
  {
    id: 'awa',
    name: 'Awa Diallo',
    role: 'Comptable junior',
    shortRole: 'Compta junior',
    initials: 'AD',
    color: '#27AE60',
    accent: '#2ECC71',
    scope: 'interne',
    description: 'Saisie quotidienne, rapprochement, import relevés, écritures à valider.',
    primaryModules: ['comptabilite', 'tresorerie', 'achats'],
    primaryKpis: ['saisies', 'rappro', 'pile_fournisseurs', 'taches'],
  },
  {
    id: 'issa',
    name: 'Issa Yomenou',
    role: 'Expert-comptable',
    shortRole: 'Expert-compta',
    initials: 'IY',
    color: '#16A085',
    accent: '#1ABC9C',
    scope: 'externe',
    description: 'Revue dossiers, conformité SYSCOHADA, commentaires, validation finale.',
    primaryModules: ['comptabilite', 'cloture', 'fiscal'],
    primaryKpis: ['dossiers', 'anomalies', 'cloture', 'liasses'],
  },
];

interface PersonaContextValue {
  persona: Persona;
  setPersona: (id: PersonaId) => void;
  personas: Persona[];
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [personaId, setPersonaId] = useState<PersonaId>('hermann');
  const persona = PERSONAS.find(p => p.id === personaId) ?? PERSONAS[0];
  return (
    <PersonaContext.Provider value={{ persona, setPersona: setPersonaId, personas: PERSONAS }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
