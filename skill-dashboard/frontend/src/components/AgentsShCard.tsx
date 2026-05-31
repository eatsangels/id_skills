import { useState } from "react";
import type { AgentsShAgent } from "../api";

interface Props {
  agent: AgentsShAgent;
  onClick: () => void;
}

export default function AgentsShCard({ agent, onClick }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(agent.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      className="w-full text-left group relative bg-surface-900/40 backdrop-blur-sm border border-surface-800/50 rounded-2xl p-5 transition-all duration-300 hover:bg-surface-900/80 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 cursor-pointer"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/0 via-transparent to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative">
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-base font-semibold text-surface-100 group-hover:text-brand-300 transition-colors leading-snug truncate">
              {agent.name}
            </h3>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-surface-800/60 text-surface-500 hover:text-brand-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
              title="Copiar slug del agente"
            >
              {copied ? (
                <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          <span className="shrink-0 text-[10px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            GitHub
          </span>
        </div>
        <p className="text-sm text-surface-400 leading-relaxed line-clamp-3 mb-4 group-hover:text-surface-300 transition-colors">
          {agent.descriptionEs || agent.description || "No hay descripción disponible"}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {agent.category && agent.category !== "Other" && (
            <span className="text-[11px] font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
              {agent.category}
            </span>
          )}
          <span className="text-xs text-surface-500 bg-surface-800/60 px-2 py-0.5 rounded-md font-mono truncate max-w-[200px]" title={agent.source}>
            {agent.source.split("/").pop()}
          </span>
        </div>
      </div>
    </div>
  );
}
