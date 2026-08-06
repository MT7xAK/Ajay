import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { AutoSuggestionCard } from './AutoSuggestionCard';
import {
  X,
  MapPin,
  Building2,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  Send,
  MessageSquare,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';

interface ComplaintModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  isAdmin: boolean;
  onUpdateStatus?: (complaintId: string, status: ComplaintStatus, adminNotes: string, officerName: string) => void;
  onSubmitFeedback?: (complaintId: string, rating: number, comment: string) => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  complaint,
  onClose,
  isAdmin,
  onUpdateStatus,
  onSubmitFeedback
}) => {
  if (!complaint) return null;

  // Admin form state
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint.status);
  const [adminNotesInput, setAdminNotesInput] = useState(complaint.adminNotes || '');
  const [officerInput, setOfficerInput] = useState(complaint.assignedOfficer || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // User feedback form state
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(!!complaint.feedback);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateStatus) {
      setIsUpdating(true);
      onUpdateStatus(complaint.id, newStatus, adminNotesInput, officerInput);
      setTimeout(() => setIsUpdating(false), 400);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitFeedback) {
      onSubmitFeedback(complaint.id, feedbackRating, feedbackComment);
      setFeedbackSubmitted(true);
    }
  };

  const steps = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
  const currentStepIdx = steps.indexOf(complaint.status);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl text-slate-800 relative">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              {complaint.id}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Category: {complaint.category}
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1 ml-auto">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(complaint.createdAt).toLocaleString()}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {complaint.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{complaint.locationText}</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-700">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Assigned: <strong>{complaint.assignedDepartment}</strong></span>
            </div>
          </div>
        </div>

        {/* Status Progress Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
            Resolution Status Tracker:
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {steps.map((st, idx) => {
              const isPassed = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;
              return (
                <div key={st} className="flex flex-col items-center">
                  <div className={`w-full h-2 rounded-full mb-2 ${
                    isPassed ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                  <span className={`text-xs font-bold ${
                    isCurrent ? 'text-emerald-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {st.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Complaint Details & Image */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Citizen Description
              </h3>
              <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line font-medium">
                {complaint.description}
              </p>
            </div>

            {/* Image Preview */}
            {complaint.imageUrl && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Uploaded Photo Evidence
                </h3>
                <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 max-h-64 flex items-center justify-center">
                  <img
                    src={complaint.imageUrl}
                    alt={complaint.title}
                    className="max-h-64 w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Citizen Info & Location coordinates */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 font-medium">
              <div className="text-slate-500 font-bold uppercase text-[10px]">Reporter Contact Info</div>
              <div className="text-slate-800">
                <strong>Name:</strong> {complaint.userName} ({complaint.userEmail})
              </div>
              <div className="text-slate-800">
                <strong>Phone:</strong> {complaint.userPhone}
              </div>
              {complaint.latitude && (
                <div className="text-blue-700 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  GPS: {complaint.latitude.toFixed(4)}, {complaint.longitude?.toFixed(4)}
                </div>
              )}
            </div>

            {/* Official Admin Notes */}
            {complaint.adminNotes && (
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs space-y-1 font-medium">
                <div className="text-indigo-900 font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Official Municipal Response
                </div>
                <p className="text-slate-800 leading-relaxed">
                  {complaint.adminNotes}
                </p>
                {complaint.assignedOfficer && (
                  <div className="text-indigo-800 text-[11px] pt-1 border-t border-indigo-200 font-bold">
                    Assigned Officer: <strong>{complaint.assignedOfficer}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Auto Suggestion Card & Admin Controls */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Auto-Solution Suggestion Analysis
              </h3>
              <AutoSuggestionCard
                category={complaint.category}
                descriptionText={complaint.description}
                aiAnalysisText={complaint.autoSuggestion.aiAnalysis}
              />
            </div>

            {/* ADMIN CONTROLS SECTION */}
            {isAdmin && onUpdateStatus && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  Admin Action Panel
                </h3>

                <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs font-medium">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Update Complaint Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 font-medium"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Assigned Field Nodal Officer
                    </label>
                    <input
                      type="text"
                      value={officerInput}
                      onChange={(e) => setOfficerInput(e.target.value)}
                      placeholder="e.g. Er. K. V. Nagesh (AEE)"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Official Remarks / Action Taken
                    </label>
                    <textarea
                      value={adminNotesInput}
                      onChange={(e) => setAdminNotesInput(e.target.value)}
                      rows={3}
                      placeholder="Enter municipal team site report or dispatch updates..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-600 resize-none font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Send className="w-4 h-4" />
                    {isUpdating ? 'Updating Status...' : 'Save & Update Status'}
                  </button>
                </form>
              </div>
            )}

            {/* USER FEEDBACK SECTION (If Complaint is RESOLVED) */}
            {complaint.status === 'RESOLVED' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-amber-500" />
                  Citizen Resolution Feedback
                </h3>

                {complaint.feedback || feedbackSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-2 font-medium">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (complaint.feedback?.rating || feedbackRating)
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-bold text-slate-900">
                        {complaint.feedback?.rating || feedbackRating} / 5 Rating
                      </span>
                    </div>
                    <p className="text-slate-700 italic">
                      "{complaint.feedback?.comment || feedbackComment || 'Resolution verified by citizen.'}"
                    </p>
                    <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Feedback recorded in municipal audit logs.
                    </div>
                  </div>
                ) : (
                  onSubmitFeedback && (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs font-medium">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Rate the resolution quality:</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setFeedbackRating(s)}
                              className={`p-2 rounded-lg border text-sm font-bold transition-all ${
                                feedbackRating === s
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {s} ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Optional Comment:</label>
                        <input
                          type="text"
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          placeholder="How satisfied are you with the resolution?"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors shadow-2xs"
                      >
                        Submit Resolution Rating
                      </button>
                    </form>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
