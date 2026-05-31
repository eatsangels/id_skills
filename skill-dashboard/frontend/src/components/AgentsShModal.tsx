import { useEffect, useState } from "react";
import type { AgentsShDetail, AgentsShAgent } from "../api";
import { fetchAgentsShDetail, installAgentsSh } from "../api";

interface Props {
  agent: AgentsShAgent;
  onClose: () => void;
  onInstallSuccess?: () => void;
}

export default function AgentsShModal({ agent, onClose, onInstallSuccess }: Props) {
  const [copied, setCopied] = useState(false);
  const [detail, setDetail] = useState<AgentsShDetail | null>(null);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLangState] = useState<"en" | "es">(() => {
    const saved = localStorage.getItem("agent-modal-lang");
    return (saved === "en" || saved === "es") ? saved : "es";
  });

  const setLang = (newLang: "en" | "es") => {
    setLangState(newLang);
    localStorage.setItem("agent-modal-lang", newLang);
  };

  useEffect(() => {
    fetchAgentsShDetail(agent.source, agent.slug)
      .then((r) => setDetail(r.agent))
      .catch(() => setDetail(null));
  }, [agent.source, agent.slug]);

  async function handleInstall() {
    setInstalling(true);
    setError("");
    try {
      await installAgentsSh(agent.source, agent.slug);
      setInstalled(true);
      if (onInstallSuccess) {
        onInstallSuccess();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al instalar");
    } finally {
      setInstalling(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl shadow-black/40 animate-scale-in flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-surface-700/30 shrink-0 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-lg font-bold text-surface-100 truncate">{agent.name}</h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(agent.slug);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-1 rounded hover:bg-surface-800/60 text-surface-500 hover:text-brand-400 transition-all cursor-pointer shrink-0"
                title="Copiar slug del agente"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <span className="text-sm text-surface-400 font-mono block truncate">{agent.source}</span>
          </div>
          <button onClick={onClose} className="text-surface-500 hover:text-surface-200 transition-colors cursor-pointer p-1 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full font-semibold">
              Agente Remoto
            </span>
            {agent.topic && (
              <span className="text-xs text-surface-400 bg-surface-800/60 px-2.5 py-1 rounded-full">{agent.topic}</span>
            )}
          </div>

          <div className="bg-surface-950/30 border border-surface-800/40 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-medium text-surface-500 uppercase tracking-wider">
                {lang === "es" ? "Descripción" : "Description"}
              </p>
              <div className="flex items-center gap-1 bg-surface-900 border border-surface-800 rounded-lg p-0.5">
                <button
                  onClick={() => setLang("en")}
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-md transition-all cursor-pointer ${lang === "en" ? "bg-brand-500 text-white shadow-sm" : "text-surface-400 hover:text-surface-200"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("es")}
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-md transition-all cursor-pointer ${lang === "es" ? "bg-brand-500 text-white shadow-sm" : "text-surface-400 hover:text-surface-200"}`}
                >
                  ES
                </button>
              </div>
            </div>
            <p className="text-sm text-surface-300 leading-relaxed">
              {lang === "es" 
                ? (agent.descriptionEs || agent.description) 
                : (agent.descriptionEn || agent.description)}
            </p>
          </div>

          {detail?.prompt && (
            <div>
              <p className="text-[11px] text-surface-500 font-semibold tracking-wider mb-2">
                {lang === "es" ? "Instrucciones / Prompt del Sistema" : "System Prompt / Instructions"}
              </p>
              <pre className="text-xs text-surface-300 bg-surface-950/60 rounded-xl p-4 border border-surface-700/30 whitespace-pre-wrap font-mono leading-relaxed max-h-80 overflow-y-auto">
                {detail.prompt.length > 4000 ? detail.prompt.slice(0, 4000) + "\n\n... (truncated)" : detail.prompt}
              </pre>
            </div>
          )}

          {!detail?.prompt && !error && (
            <p className="text-sm text-surface-500 italic">
              {lang === "es" ? "Cargando detalles del agente..." : "Loading agent details..."}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="p-5 border-t border-surface-700/30 shrink-0">
          <button
            onClick={handleInstall}
            disabled={installing || installed}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              installed
                ? "bg-brand-600/30 text-brand-400 border border-brand-500/30"
                : "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {installing 
              ? (lang === "es" ? "Instalando..." : "Installing...") 
              : installed 
                ? (lang === "es" ? "Instalado" : "Installed") 
                : (lang === "es" ? "Instalar Agente" : "Install Agent")}
          </button>
        </div>
      </div>
    </div>
  );
}
