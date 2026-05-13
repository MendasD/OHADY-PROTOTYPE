import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, X, Send, ExternalLink, User, Minimize2,
  ArrowRight,
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import type { ChatMessage } from '../../types';

const initMessages: ChatMessage[] = [
  {
    id: 'ia-init',
    role: 'assistant',
    content: 'Bonjour ! Je suis OHADY IA. Posez-moi n\'importe quelle question sur vos finances, comptes ou données.',
    timestamp: '',
  },
];

const quickReplies = [
  'Mon solde de trésorerie ?',
  'Factures en retard > 30j ?',
  'Budget consommé ce mois ?',
  'Préparer la déclaration TVA',
];

export default function IAFloatingPanel() {
  const { iaOpen, setIaOpen } = useSidebar();
  const [messages, setMessages] = useState<ChatMessage[]>(initMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iaOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, iaOpen]);

  const sendMessage = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    const ts = new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: msg, timestamp: ts }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAutoReply(msg),
        timestamp: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
        sources: ['Données OHADY — mai 2026'],
      }]);
    }, 1200 + Math.random() * 600);
  };

  return (
    <>
      {/* FAB Button */}
      {!iaOpen && (
        <button
          onClick={() => setIaOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border-0 transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #2980B9)' }}
          title="Assistant IA OHADY"
        >
          <Sparkles size={22} className="text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Panel */}
      {iaOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: 380,
            height: minimized ? 56 : 540,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
            transition: 'height 0.25s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1A3C5E 0%, #2D5D8E 100%)' }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(196,132,252,0.25)', border: '1px solid rgba(196,132,252,0.4)' }}>
              <Sparkles size={15} className="text-purple-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold leading-none">Assistant OHADY</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-white/50 text-[10px]">En ligne · Données temps réel</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/intelligence"
                onClick={() => setIaOpen(false)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-colors no-underline"
                title="Ouvrir l'assistant complet"
              >
                <ExternalLink size={11} /> Plein écran
              </Link>
              <button
                onClick={() => setMinimized(m => !m)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border-0"
              >
                <Minimize2 size={13} className="text-white/60" />
              </button>
              <button
                onClick={() => setIaOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors border-0"
              >
                <X size={13} className="text-white/60" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-neutral-50"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-purple-500 to-secondary' : 'bg-accent'}`}>
                      {msg.role === 'assistant'
                        ? <Sparkles size={10} className="text-white" />
                        : <User size={10} className="text-white" />
                      }
                    </div>
                    <div className={`max-w-[75%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-secondary text-white rounded-tr-sm'
                          : 'bg-white text-neutral-700 border border-neutral-100 rounded-tl-sm shadow-card'
                      }`}>
                        {msg.content}
                      </div>
                      {msg.sources && (
                        <div className="flex gap-1">
                          {msg.sources.map(s => (
                            <span key={s} className="text-[9px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-secondary flex items-center justify-center">
                      <Sparkles size={10} className="text-white" />
                    </div>
                    <div className="bg-white border border-neutral-100 rounded-xl rounded-tl-sm px-3 py-2 shadow-card">
                      <div className="flex gap-1">
                        {[0, 150, 300].map(delay => (
                          <div key={delay} className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              <div className="px-3 pt-2 pb-1 bg-white border-t border-neutral-100 flex gap-1.5 overflow-x-auto"
                style={{ scrollbarWidth: 'none' }}>
                {quickReplies.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="flex-shrink-0 text-[10px] px-2.5 py-1.5 rounded-full border border-neutral-200 text-neutral-600 hover:bg-secondary hover:text-white hover:border-secondary transition-all whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-3 py-3 bg-white flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Posez votre question..."
                  className="input text-xs flex-1 py-2"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="btn btn-primary px-3 py-2 disabled:opacity-50"
                >
                  <Send size={13} />
                </button>
              </div>

              {/* Footer link */}
              <div className="px-4 py-2 bg-white border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">Données isolées · Aucun envoi externe</span>
                <Link
                  to="/intelligence"
                  onClick={() => setIaOpen(false)}
                  className="flex items-center gap-1 text-[10px] text-secondary font-medium hover:underline no-underline"
                >
                  Interface complète <ArrowRight size={10} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

function getAutoReply(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('solde') || m.includes('trésorerie')) return 'Votre trésorerie nette est de **23 415 000 XOF** ce jour (13/05/2026), répartis sur 5 comptes (SGBS, CBAO, Wave, Orange Money, Caisse principale).';
  if (m.includes('retard') || m.includes('facture')) return '**4 factures en retard** pour un total de **27 900 000 XOF** : SENELEC (63j), Ministère Finances (33j), Dakar Dem Dikk (12j), ICTS Global (72j — litige).';
  if (m.includes('budget')) return 'Budget global consommé à **78%** (réalisé + engagé). Point d\'attention : Marketing dépassé à **104%**, soit -50 000 XOF de découvert.';
  if (m.includes('tva') || m.includes('déclaration')) return 'La TVA de **mai 2026** n\'est pas encore calculée. Échéance : 20/06/2026. TVA collectée estimée : **1 848 000 XOF**, TVA déductible : **324 000 XOF**, TVA à décaisser : **1 524 000 XOF**.';
  return 'Je recherche dans vos données de mai 2026... Voici ce que j\'ai trouvé. Souhaitez-vous plus de détails ou que j\'exporte ce résultat en rapport ?';
}
