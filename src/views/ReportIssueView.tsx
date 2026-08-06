import React, { useState } from 'react';
import { Complaint, ComplaintCategory, User } from '../types';
import { AutoSuggestionCard } from '../components/AutoSuggestionCard';
import {
  Trash2,
  Construction,
  Droplets,
  Zap,
  Waves,
  TrafficCone,
  ShieldAlert,
  MapPin,
  Camera,
  Upload,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ReportIssueViewProps {
  currentUser: User | null;
  onComplaintCreated: (complaint: Complaint) => void;
  onNavigateHistory: () => void;
}

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  currentUser,
  onComplaintCreated,
  onNavigateHistory
}) => {
  const [category, setCategory] = useState<ComplaintCategory>('ROAD');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successComplaint, setSuccessComplaint] = useState<Complaint | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const categories = [
    { id: 'GARBAGE', label: 'Garbage & Waste', icon: Trash2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 'ROAD', label: 'Roads & Potholes', icon: Construction, color: 'text-amber-800 bg-amber-50 border-amber-200' },
    { id: 'WATER', label: 'Water Supply', icon: Droplets, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { id: 'ELECTRICITY', label: 'Electricity Hazard', icon: Zap, color: 'text-yellow-800 bg-yellow-50 border-yellow-200' },
    { id: 'SEWAGE', label: 'Sewage Overflow', icon: Waves, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { id: 'TRAFFIC', label: 'Traffic Signal', icon: TrafficCone, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  ];

  // Handle GPS Auto-Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setLocationText(`GPS Loc: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)} (Near City Central Ward)`);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setLocationText('MG Road Ward 45, Indiranagar (Manual Location Entry)');
      }
    );
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !description.trim() || !locationText.trim()) {
      setErrorMsg('Please fill in all required fields (Title, Description, and Location).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'usr-guest',
          userName: currentUser?.name || 'Citizen User',
          userEmail: currentUser?.email || 'citizen@example.com',
          userPhone: currentUser?.phone || '+91 98000 00000',
          category,
          title,
          description,
          locationText,
          latitude,
          longitude,
          imageUrl,
          priority: description.toLowerCase().includes('urgent') || description.toLowerCase().includes('danger') ? 'HIGH' : 'MEDIUM'
        })
      });

      const data = await res.json();

      if (data.success && data.complaint) {
        onComplaintCreated(data.complaint);
        setSuccessComplaint(data.complaint);
      } else {
        setErrorMsg(data.error || 'Failed to submit complaint.');
      }
    } catch (err) {
      setErrorMsg('Server connection error. Please check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successComplaint) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-emerald-200 rounded-3xl p-8 shadow-md text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Complaint Registered: {successComplaint.id}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-3">
            Grievance Submitted Successfully!
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Your complaint has been logged and auto-routed to <strong className="text-slate-900">{successComplaint.assignedDepartment}</strong>.
          </p>
        </div>

        <div className="text-left">
          <AutoSuggestionCard
            category={successComplaint.category}
            descriptionText={successComplaint.description}
            aiAnalysisText={successComplaint.autoSuggestion.aiAnalysis}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onNavigateHistory}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm shadow-blue-600/20"
          >
            View Complaint Status in My Complaints
          </button>
          <button
            onClick={() => {
              setSuccessComplaint(null);
              setTitle('');
              setDescription('');
              setLocationText('');
              setImageUrl('');
              setImagePreview('');
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-xl transition-all border border-slate-200"
          >
            File Another Complaint
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Report Civic Issue</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Submit details & photo evidence. The Auto-Suggestion Engine will route your grievance to the proper department instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              1. Select Issue Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as ComplaintCategory)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-slate-900 shadow-xs ring-2 ring-blue-600/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border mb-2 ${cat.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Complaint Short Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Deep Pothole on MG Road near Metro Pillar 142"
              className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-medium"
            />
          </div>

          {/* Description Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Detailed Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">{description.length}/500 chars</span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue size, duration, urgency, and any immediate hazard..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 resize-none leading-relaxed font-medium"
            />
          </div>

          {/* Location Input & Geolocation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Location / Street Address <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                {isLocating ? 'Locating...' : 'Detect My GPS'}
              </button>
            </div>
            <input
              type="text"
              required
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="e.g., Ward 45, Near Gate 2, Model Public School, Indiranagar"
              className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 font-medium"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              5. Photo Evidence Upload (Optional)
            </label>
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 text-center">
              {imagePreview ? (
                <div className="relative max-h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageUrl(''); setImagePreview(''); }}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-lg font-medium"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-4 text-slate-500 hover:text-slate-800 transition-colors">
                  <Camera className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-xs font-bold text-slate-800">Click to Upload Photo</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG or JPEG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Routing Complaint & AI Analysis...' : 'Submit Complaint to Department'}
          </button>
        </form>

        {/* Right Preview Column: Real-time Auto-Suggestion Live Preview */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Live Rule Engine Auto-Suggestion
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              As you fill the form, the rule engine automatically forecasts the municipal department assignment:
            </p>
            <AutoSuggestionCard
              category={category}
              descriptionText={description}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
