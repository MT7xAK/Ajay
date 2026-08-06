import React, { useState } from 'react';
import { Complaint, ComplaintCategory } from '../types';
import { AutoSuggestionCard } from '../components/AutoSuggestionCard';
import { ComplaintCard } from '../components/ComplaintCard';
import {
  ShieldCheck,
  Zap,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  Search,
  Sparkles,
  Award,
  Layers,
  PhoneCall,
  FileCode2
} from 'lucide-react';

interface HomeViewProps {
  complaints: Complaint[];
  onNavigateReport: () => void;
  onNavigateDeliverables: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  complaints,
  onNavigateReport,
  onNavigateDeliverables,
  onSelectComplaint
}) => {
  // Test Sandbox State
  const [sandboxCategory, setSandboxCategory] = useState<ComplaintCategory>('ROAD');
  const [sandboxDesc, setSandboxDesc] = useState<string>('Deep pothole near school gate causing vehicle skidding.');

  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl space-y-6 relative z-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Smart Local Problem Reporter & <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">Auto-Solution Suggestion</span> System
          </h1>

          <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            A civic complaint management portal where citizens report local civic issues (garbage, potholes, water leaks, electricity hazards) and receive <strong className="text-white font-bold">instant rule-based department suggestions</strong>, emergency hotlines, and SLA tracking.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onNavigateReport}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm"
            >
              <PlusCircle className="w-5 h-5" />
              Report a Civic Issue Now
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-white">{totalCount}</div>
            <div className="text-xs text-slate-300 font-medium mt-1">Total Issues Logged</div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-xs text-slate-300 font-medium mt-1">Pending Triage</div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-blue-400">{inProgressCount}</div>
            <div className="text-xs text-slate-300 font-medium mt-1">In Field Action</div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{resolvedCount}</div>
            <div className="text-xs text-slate-300 font-medium mt-1">Resolved Successfully</div>
          </div>
        </div>
      </section>

      {/* Interactive Auto-Suggestion Engine Sandbox */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              Core Feature Highlight
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Interactive Auto-Suggestion Engine Sandbox
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Test how the rule-based algorithm maps complaint categories to designated municipal departments instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Input */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                1. Select Civic Category:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['GARBAGE', 'ROAD', 'WATER', 'ELECTRICITY', 'SEWAGE', 'TRAFFIC'] as ComplaintCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSandboxCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border ${
                      sandboxCategory === cat
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                2. Type Sample Problem Description:
              </label>
              <textarea
                value={sandboxDesc}
                onChange={(e) => setSandboxDesc(e.target.value)}
                rows={3}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 resize-none font-medium"
              />
            </div>

            <div className="text-[11px] text-slate-600 bg-blue-50/60 p-3 rounded-xl border border-blue-100 font-medium">
              💡 <strong>How it works:</strong> The Rule-Based Engine evaluates category codes and description keywords to output designated department names, SLAs, emergency hotlines, and safety warnings.
            </div>
          </div>

          {/* Live Result Output */}
          <div className="lg:col-span-7">
            <AutoSuggestionCard
              category={sandboxCategory}
              descriptionText={sandboxDesc}
            />
          </div>
        </div>
      </section>

      {/* Workflow Architecture Steps */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">System Workflow Architecture</h2>
          <p className="text-xs text-slate-500 font-medium">
            End-to-end lifecycle of a civic complaint from citizen reporting to municipal resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200">1</div>
            <h3 className="font-bold text-slate-900 text-sm">Citizen Filing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              User submits issue with title, category, description, photo evidence, and location coordinates.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-200">2</div>
            <h3 className="font-bold text-slate-900 text-sm">Auto-Suggestion Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Algorithm maps the complaint to its nodal municipal department, sets resolution SLA, and generates safety advice.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold text-sm flex items-center justify-center border border-amber-200">3</div>
            <h3 className="font-bold text-slate-900 text-sm">Admin Triage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Municipal officer inspects issue details, assigns field crew, and transitions status (Pending → In Progress).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center border border-emerald-200">4</div>
            <h3 className="font-bold text-slate-900 text-sm">Resolution & Rating</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Issue fixed on site, marked as Resolved, and citizen rates the resolution quality with feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Reported Complaints Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Public Civic Complaints</h2>
            <p className="text-xs text-slate-500 font-medium">Live feed of public grievances logged in the system</p>
          </div>
          <button
            onClick={onNavigateReport}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Report New Complaint <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.slice(0, 6).map((comp) => (
            <ComplaintCard
              key={comp.id}
              complaint={comp}
              onSelect={onSelectComplaint}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
