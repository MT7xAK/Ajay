import React from 'react';
import { Complaint } from '../types';
import {
  Trash2,
  Construction,
  Droplets,
  Zap,
  Waves,
  TrafficCone,
  ShieldAlert,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star
} from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onSelect: (complaint: Complaint) => void;
  isAdminView?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onSelect,
  isAdminView = false
}) => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'GARBAGE':
        return { label: 'Garbage & Waste', icon: Trash2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'ROAD':
        return { label: 'Roads & Potholes', icon: Construction, color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'WATER':
        return { label: 'Water Supply', icon: Droplets, color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'ELECTRICITY':
        return { label: 'Electricity Hazard', icon: Zap, color: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
      case 'SEWAGE':
        return { label: 'Sewage Overflow', icon: Waves, color: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'TRAFFIC':
        return { label: 'Traffic & Signal', icon: TrafficCone, color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Public Issue', icon: ShieldAlert, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock };
      case 'IN_PROGRESS':
        return { label: 'In Progress', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: AlertCircle };
      case 'RESOLVED':
        return { label: 'Resolved', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      default:
        return { label: 'Rejected', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertCircle };
    }
  };

  const categoryInfo = getCategoryBadge(complaint.category);
  const statusInfo = getStatusBadge(complaint.status);
  const CategoryIcon = categoryInfo.icon;
  const StatusIcon = statusInfo.icon;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onClick={() => onSelect(complaint)}
      className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-2xs"
    >
      {/* Top Bar: Category & Status Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${categoryInfo.color}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            {categoryInfo.label}
          </span>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${statusInfo.bg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusInfo.label}
          </span>
        </div>

        {/* Complaint ID & Title */}
        <div className="mb-2">
          <div className="text-[11px] font-mono text-slate-500 mb-0.5 flex items-center justify-between">
            <span>ID: <strong className="text-blue-600 font-semibold">{complaint.id}</strong></span>
            <span>{formatDate(complaint.createdAt)}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {complaint.title}
          </h3>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {complaint.description}
        </p>

        {/* Image Preview Thumbnail if exists */}
        {complaint.imageUrl && (
          <div className="mb-3 h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded font-medium">
              Attached Photo
            </div>
          </div>
        )}

        {/* Location & Department Info */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-slate-700 truncate font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{complaint.locationText}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 truncate">
            <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate text-indigo-700 font-semibold">{complaint.assignedDepartment}</span>
          </div>
        </div>
      </div>

      {/* Footer / Feedback Badge / Admin Notes indicator */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {complaint.feedback && (
            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-semibold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {complaint.feedback.rating}/5 Rated
            </span>
          )}
          {isAdminView && complaint.userName && (
            <span className="text-[11px] text-slate-500 truncate max-w-[120px] font-medium">
              By: {complaint.userName}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(complaint);
          }}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </button>
      </div>
    </div>
  );
};
