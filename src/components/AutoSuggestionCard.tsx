import React from 'react';
import { ComplaintCategory } from '../types';
import { AUTO_SUGGESTION_RULES, getAutoSuggestion } from '../data/rules';
import {
  Building2,
  Phone,
  Mail,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AutoSuggestionCardProps {
  category: ComplaintCategory;
  descriptionText?: string;
  aiAnalysisText?: string;
  isCompact?: boolean;
}

export const AutoSuggestionCard: React.FC<AutoSuggestionCardProps> = ({
  category,
  descriptionText = '',
  aiAnalysisText,
  isCompact = false
}) => {
  const rule = AUTO_SUGGESTION_RULES[category] || AUTO_SUGGESTION_RULES.GARBAGE;
  const suggestion = getAutoSuggestion(category, descriptionText);

  return (
    <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm text-slate-800 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-100/60 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
              Rule-Based Auto-Suggestion Engine
            </span>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              Auto-Routed Department Match
            </h4>
          </div>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
          SLA: {rule.estimatedHours} Hours
        </span>
      </div>

      {/* Main Department Banner */}
      <div className="bg-blue-50/70 rounded-xl p-3.5 mb-4 border border-blue-100 flex items-start gap-3">
        <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-blue-900/70 font-medium">Designated Municipal Authority</div>
          <div className="font-bold text-blue-950 text-sm sm:text-base leading-snug">
            {rule.departmentName}
          </div>
          <div className="text-xs text-blue-900/80 mt-1 flex flex-wrap items-center gap-2">
            <span>Code: <strong className="text-blue-700 font-semibold">{rule.departmentCode}</strong></span>
            <span>•</span>
            <span>Officer: <span className="text-slate-800 font-medium">{rule.nodalOfficer}</span></span>
          </div>
        </div>
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="truncate">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Emergency Helpline</span>
            <span className="font-bold text-emerald-700">{rule.contactPhone}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="truncate">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Target Resolution SLA</span>
            <span className="font-bold text-amber-800">{rule.timeframeText}</span>
          </div>
        </div>
      </div>

      {/* Step-By-Step Workflow */}
      {!isCompact && (
        <div className="mb-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Automated Protocol Workflow:
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {rule.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug font-medium text-slate-800">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Analysis Box (If Gemini generated notes) */}
      {(aiAnalysisText || (suggestion.detectedKeywords && suggestion.detectedKeywords.length > 0)) && (
        <div className="mb-3 bg-purple-50/70 border border-purple-200 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-1.5 text-purple-900 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            AI & Rule Intelligence Insight:
          </div>
          {aiAnalysisText && (
            <p className="text-slate-800 leading-relaxed italic mb-2">
              "{aiAnalysisText}"
            </p>
          )}
          {suggestion.detectedKeywords && suggestion.detectedKeywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-600 text-[11px] font-medium">Detected Triggers:</span>
              {suggestion.detectedKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-semibold">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Citizen Safety Advice Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 block mb-0.5">Safety Precaution Advisory</span>
          <p className="text-slate-700 leading-relaxed text-[11px] font-medium">{rule.safetyAdvice}</p>
        </div>
      </div>
    </div>
  );
};
