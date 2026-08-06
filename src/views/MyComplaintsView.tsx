import React, { useState } from 'react';
import { Complaint, User } from '../types';
import { ComplaintCard } from '../components/ComplaintCard';
import { ComplaintModal } from '../components/ComplaintModal';
import { Search, Filter, PlusCircle, FileText, CheckCircle2 } from 'lucide-react';

interface MyComplaintsViewProps {
  currentUser: User | null;
  complaints: Complaint[];
  onNavigateReport: () => void;
  onSubmitFeedback: (complaintId: string, rating: number, comment: string) => void;
}

export const MyComplaintsView: React.FC<MyComplaintsViewProps> = ({
  currentUser,
  complaints,
  onNavigateReport,
  onSubmitFeedback
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // Filter complaints
  const filtered = complaints.filter((c) => {
    // If logged in user, optionally filter by user's complaints
    const matchesUser = !currentUser || c.userId === currentUser.id || c.userId === 'usr-101' || c.userId === 'usr-guest';
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locationText.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUser && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Complaint History</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Track status updates, SLA progress, official municipal responses, and submit resolution feedback.
          </p>
        </div>

        <button
          onClick={onNavigateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-600/20 flex items-center gap-2 text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Submit New Complaint
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Complaint ID, title, or location..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-medium"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap border ${
                selectedStatus === st
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Complaints Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
            No complaints match your current search or filter criteria. Try clearing search keywords or report a new issue.
          </p>
          <button
            onClick={onNavigateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm"
          >
            Report Issue Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp) => (
            <ComplaintCard
              key={comp.id}
              complaint={comp}
              onSelect={(c) => setActiveComplaint(c)}
            />
          ))}
        </div>
      )}

      {/* Complaint Detail Modal */}
      {activeComplaint && (
        <ComplaintModal
          complaint={activeComplaint}
          onClose={() => setActiveComplaint(null)}
          isAdmin={false}
          onSubmitFeedback={onSubmitFeedback}
        />
      )}
    </div>
  );
};
