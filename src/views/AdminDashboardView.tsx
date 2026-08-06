import React, { useState } from 'react';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';
import { ComplaintModal } from '../components/ComplaintModal';
import {
  LayoutDashboard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Download,
  Users,
  ShieldCheck,
  Star,
  Edit
} from 'lucide-react';

interface AdminDashboardViewProps {
  complaints: Complaint[];
  onUpdateStatus: (complaintId: string, status: ComplaintStatus, adminNotes: string, officerName: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  complaints,
  onUpdateStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // Metrics calculation
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  const ratedComplaints = complaints.filter(c => c.feedback?.rating);
  const avgSatisfaction = ratedComplaints.length > 0
    ? (ratedComplaints.reduce((acc, c) => acc + (c.feedback?.rating || 0), 0) / ratedComplaints.length).toFixed(1)
    : '4.8';

  // Filtered List
  const filtered = complaints.filter(c => {
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locationText.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesStatus && matchesSearch;
  });

  // Export CSV Helper
  const handleExportCSV = () => {
    const headers = ['Complaint ID', 'User Name', 'Category', 'Title', 'Location', 'Status', 'Assigned Dept', 'Date Logged'];
    const rows = complaints.map(c => [
      c.id,
      `"${c.userName}"`,
      c.category,
      `"${c.title}"`,
      `"${c.locationText}"`,
      c.status,
      `"${c.assignedDepartment}"`,
      c.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `municipal_complaints_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Municipal Authority Administration Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Grievance Oversight Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Review incoming civic complaints, inspect rule-based suggestions, assign officers, and update resolution statuses.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-2xs"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          Export Report (CSV)
        </button>
      </div>

      {/* Overview Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
          <div className="text-xs text-slate-500 font-bold uppercase">Total Filed</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Across all wards</div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
          <div className="text-xs text-amber-700 font-bold uppercase">Pending Triage</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Awaiting inspection</div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
          <div className="text-xs text-blue-700 font-bold uppercase">In Progress</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{inProgressCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Field crew assigned</div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
          <div className="text-xs text-emerald-700 font-bold uppercase">Resolved</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Verified & closed</div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl col-span-2 lg:col-span-1 shadow-2xs">
          <div className="text-xs text-amber-800 font-bold uppercase flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Citizen Rating
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{avgSatisfaction} <span className="text-xs font-medium text-slate-500">/ 5.0</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Satisfaction score</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 flex flex-col md:flex-row gap-4 items-center justify-between text-xs shadow-2xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, citizen name, location..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-10 pr-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-medium"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-medium">
          <div>
            <span className="text-slate-600 mr-2">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="GARBAGE">Garbage</option>
              <option value="ROAD">Roads</option>
              <option value="WATER">Water</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="SEWAGE">Sewage</option>
              <option value="TRAFFIC">Traffic</option>
            </select>
          </div>

          <div>
            <span className="text-slate-600 mr-2">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Complaint ID</th>
                <th className="p-4">Citizen Info</th>
                <th className="p-4">Category & Title</th>
                <th className="p-4">Auto-Assigned Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                    No complaints match current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {comp.id}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900">{comp.userName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{comp.userPhone}</div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-slate-800 truncate">{comp.title}</div>
                      <div className="text-[10px] text-indigo-700 font-bold uppercase">
                        {comp.category}
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="truncate text-slate-700 font-semibold">{comp.assignedDepartment}</div>
                      {comp.assignedOfficer && (
                        <div className="text-[10px] text-amber-700 font-semibold">Officer: {comp.assignedOfficer}</div>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                        comp.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : comp.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {comp.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveComplaint(comp)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-700" />
                        Manage / Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Modal with Admin Edit Form */}
      {activeComplaint && (
        <ComplaintModal
          complaint={activeComplaint}
          onClose={() => setActiveComplaint(null)}
          isAdmin={true}
          onUpdateStatus={(id, st, notes, officer) => {
            onUpdateStatus(id, st, notes, officer);
            setActiveComplaint(null);
          }}
        />
      )}
    </div>
  );
};
