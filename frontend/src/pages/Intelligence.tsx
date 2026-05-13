import { useState, useRef, useEffect } from 'react';
import {
  Send, Sparkles, Scan, AlertTriangle, RefreshCw,
  FileText, Upload, CheckCircle, Eye, X, Loader2,
  Bot, User, Copy, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { chatMessages } from '../data/mockData';
import type { ChatMessage } from '../types';

const mockAnomalies = [
  { id: 'an1', type: 'Double saisie probable', severity: 'error',   desc: 'Écriture BQ-2026-0812 et BQ-2026-0819 semblent identiques (même montant, même tiers, même date)', account: '41100 — SONES' },
  { id: 'an2', type: 'Solde anormal',          severity: 'warning', desc: 'Compte 44310 (TVA collectée) créditeur de 0 XOF — aucune TVA collectée saisie en mai 2026 ?', account: '44310 — TVA collectée' },
  { id: 'an3', type: 'Écriture en suspens',    severity: 'warning', desc: 'Écriture OD-2026-0098 sans justificatif depuis 23 jours (libellé : "Régularisation à identifier")', account: '47100 — Suspens' },
  { id: 'an4', type: 'Provision manquante',    severity: 'info',    desc: 'Aucune provision pour créances douteuses sur ICTS Global (72j de retard, 3 800 000 XOF)', account: '41900 — Clients douteux' },
];

const ocrPreviewFields = [
  { label: 'Fournisseur',   value: 'COGEMATEC SARL',      confidence: 98 },
  { label: 'N° Facture',    value: 'COGE-2026-1247',      confidence: 96 },
  { label: 'Date',          value: '10/05/2026',           confidence: 99 },
  { label: 'Montant HT',    value: '1 800 000 XOF',       confidence: 95 },
  { label: 'TVA (18%)',     value: '324 000 XOF',          confidence: 92 },
  { label: 'Montant TTC',   value: '2 124 000 XOF',       confidence: 97 },
  { label: 'Échéance',      value: '10/06/2026',           confidence: 88 },
  { label: 'Référence PO',  value: 'Bon commande BC-0419', confidence: 82 },
];

const severityStyle: Record<string, { icon: React.ElementType; badge: string; iconColor: string; bg: string }> = {
  error:   { icon: AlertTriangle, badge: 'badge-red',    iconColor: 'text-danger',   bg: 'bg-red-50'    },
  warning: { icon: AlertTriangle, badge: 'badge-orange', iconColor: 'text-orange-500', bg: 'bg-orange-50' },
  info:    { icon: Eye,           badge: 'badge-blue',   iconColor: 'text-blue-500', bg: 'bg-blue-50'   },
};

function Markdown({ text }: { text: string }) {
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {text.split('\n').map((line, i) => {
        if (line === '---') return <hr key={i} className="border-neutral-200 my-2" />;
        const rendered = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        return <p key={i} dangerouslySetInnerHTML={{ __html: rendered || '&nbsp;' }} />;
      })}
    </div>
  );
}

export default function Intelligence() {
  const [activeTab, setActiveTab] = useState<'chat' | 'ocr' | 'anomalies'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ocrState, setOcrState] = useState<'idle' | 'processing' | 'done'>('idle');
  const [isDragOver, setIsDragOver] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `cm${Date.now()}`, role: 'user', content: input, timestamp: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `cm${Date.now()}`, role: 'assistant',
        content: 'Je recherche dans vos données financières...\n\nD\'après les écritures de mai 2026, voici les informations disponibles. Voulez-vous que je génère un rapport détaillé ou que j\'exporte ces données ?',
        timestamp: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
        sources: ['Données comptables mai 2026'],
      }]);
    }, 1800);
  };

  const startOCR = () => {
    setOcrState('processing');
    setTimeout(() => setOcrState('done'), 2200);
  };

  const suggestions = [
    'Quelle est ma trésorerie prévisionnelle à 30 jours ?',
    'Quels clients ont des factures en retard > 30 jours ?',
    'Prépare la déclaration TVA de mai 2026',
    'Analyse mes marges par client ce trimestre',
  ];

  return (
    <div className="space-y-4 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Sparkles size={22} className="text-purple-500" /> Intelligence IA
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Assistant financier · OCR intelligent · Détection d'anomalies</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        {[
          { id: 'chat',      label: 'Assistant IA',    icon: Bot         },
          { id: 'ocr',       label: 'OCR & Saisie',    icon: Scan        },
          { id: 'anomalies', label: `Anomalies (${mockAnomalies.length})`, icon: AlertTriangle },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-neutral-800 shadow-card' : 'text-neutral-500 hover:text-neutral-700'
              }`}>
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chat */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-[620px]">
          {/* Chat main */}
          <div className="card xl:col-span-3 flex flex-col p-0 overflow-hidden">
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #1A3C5E, #234E7A)' }}>
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                <Sparkles size={16} className="text-purple-300" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Assistant OHADY</div>
                <div className="text-white/50 text-xs">Analyse vos données financières en temps réel · SYSCOHADA natif</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/50 text-xs">En ligne</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-purple-500 to-secondary'
                      : 'bg-accent'
                  }`}>
                    {msg.role === 'assistant' ? <Sparkles size={12} className="text-white" /> : <User size={12} className="text-white" />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-secondary text-white rounded-tr-sm'
                        : 'bg-neutral-50 border border-neutral-100 text-neutral-800 rounded-tl-sm'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : (
                        <Markdown text={msg.content} />
                      )}
                    </div>
                    {msg.sources && (
                      <div className="flex flex-wrap gap-1 px-1">
                        {msg.sources.map(s => (
                          <span key={s} className="badge badge-gray text-[10px]"><FileText size={9} /> {s}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] text-neutral-400">{msg.timestamp}</span>
                      {msg.role === 'assistant' && (
                        <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                          <button className="btn btn-ghost btn-sm py-0.5 px-1"><Copy size={10} /></button>
                          <button className="btn btn-ghost btn-sm py-0.5 px-1"><ThumbsUp size={10} /></button>
                          <button className="btn btn-ghost btn-sm py-0.5 px-1"><ThumbsDown size={10} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-secondary flex items-center justify-center">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-neutral-100">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Posez une question sur vos finances, clients, budget..."
                  className="input flex-1"
                />
                <button onClick={sendMessage} disabled={!input.trim() || isTyping}
                  className="btn btn-primary px-4 disabled:opacity-50">
                  <Send size={14} />
                </button>
              </div>
              <div className="text-[10px] text-neutral-400 mt-2 text-center">
                L'assistant accède uniquement à vos données OHADY · Aucune donnée envoyée à des tiers
              </div>
            </div>
          </div>

          {/* Suggestions sidebar */}
          <div className="flex flex-col gap-4">
            <div className="card">
              <h3 className="text-sm font-semibold text-neutral-800 mb-3">Suggestions</h3>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setInput(s)}
                    className="w-full text-left text-xs p-3 rounded-lg bg-neutral-50 border border-neutral-100 hover:bg-blue-50 hover:border-blue-200 transition-all text-neutral-700 hover:text-secondary leading-snug">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="card bg-purple-50 border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-purple-500" />
                <span className="text-xs font-semibold text-purple-800">Capacités IA</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-purple-700">
                <li>✓ Analyse financière SYSCOHADA</li>
                <li>✓ Génération de lettres de relance</li>
                <li>✓ Préparation déclarations TVA/DSF</li>
                <li>✓ Prévisions budgétaires</li>
                <li>✓ Détection d'anomalies</li>
                <li>✓ Rapports et tableaux de bord</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* OCR */}
      {activeTab === 'ocr' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Drop zone */}
          <div className="card flex flex-col">
            <h2 className="section-title mb-1">Dépôt de document</h2>
            <p className="text-xs text-neutral-400 mb-4">PDF, image (JPG, PNG) ou photo de facture · Jusqu'à 10 MB</p>

            {ocrState === 'idle' && (
              <div
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={e => { e.preventDefault(); setIsDragOver(false); startOCR(); }}
                onClick={startOCR}
                className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all min-h-[300px] ${
                  isDragOver ? 'border-secondary bg-blue-50' : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                <Upload size={32} className="text-neutral-400 mb-3" />
                <div className="text-sm font-medium text-neutral-600">Glissez-déposez votre facture ici</div>
                <div className="text-xs text-neutral-400 mt-1">ou cliquez pour parcourir</div>
                <div className="flex gap-2 mt-4">
                  {['PDF', 'JPG', 'PNG', 'HEIC'].map(f => (
                    <span key={f} className="badge badge-gray text-[10px]">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {ocrState === 'processing' && (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 size={32} className="text-secondary animate-spin mb-3" />
                <div className="text-sm font-medium text-neutral-700">Analyse en cours (OCR + IA)...</div>
                <div className="text-xs text-neutral-400 mt-2">AWS Textract · Claude · Validation SYSCOHADA</div>
                <div className="mt-4 w-48 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary animate-pulse rounded-full w-3/4" />
                </div>
              </div>
            )}

            {ocrState === 'done' && (
              <div className="flex-1">
                <div className="rounded-xl bg-neutral-800 p-4 flex items-center justify-center min-h-[200px] mb-4">
                  <div className="text-center text-neutral-500">
                    <FileText size={40} className="mx-auto mb-2" />
                    <div className="text-xs">COGE-2026-1247.pdf</div>
                    <div className="text-[10px] mt-1">2 pages · 847 KB</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOcrState('idle')} className="btn btn-outline btn-sm flex-1"><X size={12} /> Changer</button>
                  <button className="btn btn-primary btn-sm flex-1"><CheckCircle size={12} /> Valider et comptabiliser</button>
                </div>
              </div>
            )}
          </div>

          {/* Extracted fields */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Données extraites</h2>
              {ocrState === 'done' && (
                <span className="badge badge-green text-[10px]"><CheckCircle size={10} /> Confiance globale : 94%</span>
              )}
            </div>

            {ocrState !== 'done' && (
              <div className="text-center py-16 text-neutral-400">
                <Scan size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Déposez un document pour voir les champs extraits</p>
              </div>
            )}

            {ocrState === 'done' && (
              <>
                <div className="space-y-3 mb-5">
                  {ocrPreviewFields.map(field => (
                    <div key={field.label} className="flex items-center gap-3">
                      <label className="w-28 flex-shrink-0 mb-0">{field.label}</label>
                      <input className="input text-sm flex-1" defaultValue={field.value} />
                      <div className={`text-xs font-semibold w-10 text-right ${
                        field.confidence >= 90 ? 'text-success' : field.confidence >= 75 ? 'text-orange-500' : 'text-danger'
                      }`}>{field.confidence}%</div>
                    </div>
                  ))}
                </div>

                <div className="divider" />
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="text-xs font-semibold text-blue-800 mb-2">
                    <Sparkles size={12} className="inline mr-1" /> Écriture comptable proposée
                  </div>
                  <table className="w-full text-xs">
                    <thead><tr><th className="text-left py-1 text-blue-700">Compte</th><th className="text-right py-1 text-blue-700">Débit</th><th className="text-right py-1 text-blue-700">Crédit</th></tr></thead>
                    <tbody className="text-blue-900">
                      <tr><td>60100 — Achats marchandises</td><td className="text-right">1 800 000</td><td className="text-right">—</td></tr>
                      <tr><td>44510 — TVA déductible 18%</td><td className="text-right">324 000</td><td className="text-right">—</td></tr>
                      <tr><td>40100 — Fournisseur COGEMATEC</td><td className="text-right">—</td><td className="text-right">2 124 000</td></tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Anomalies */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="card bg-amber-50 border-amber-100">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-amber-600" />
              <div>
                <div className="text-sm font-semibold text-amber-900">{mockAnomalies.length} anomalies détectées dans vos données comptables</div>
                <div className="text-xs text-amber-700 mt-0.5">Dernière analyse : il y a 47 minutes · Base : 2 847 écritures de mai 2026</div>
              </div>
              <button className="ml-auto btn btn-outline btn-sm border-amber-300 text-amber-700 hover:bg-amber-100">
                <RefreshCw size={12} /> Relancer l'analyse
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {mockAnomalies.map(anomaly => {
              const style = severityStyle[anomaly.severity];
              const Icon = style.icon;
              return (
                <div key={anomaly.id} className={`card border ${anomaly.severity === 'error' ? 'border-red-200' : anomaly.severity === 'warning' ? 'border-orange-200' : 'border-blue-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                      <Icon size={16} className={style.iconColor} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-neutral-800">{anomaly.type}</span>
                        <span className={`badge ${style.badge} text-[10px]`}>
                          {anomaly.severity === 'error' ? 'Critique' : anomaly.severity === 'warning' ? 'Attention' : 'Info'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-snug">{anomaly.desc}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="badge badge-gray text-[10px]"><FileText size={9} /> {anomaly.account}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="btn btn-primary btn-sm"><Eye size={11} /> Examiner</button>
                        <button className="btn btn-outline btn-sm text-xs">Ignorer</button>
                        <button className="btn btn-ghost btn-sm text-xs text-purple-600">
                          <Sparkles size={11} /> Demander à l'IA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
