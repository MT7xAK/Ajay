export type ComplaintCategory =
  | 'GARBAGE'
  | 'ROAD'
  | 'WATER'
  | 'ELECTRICITY'
  | 'SEWAGE'
  | 'TRAFFIC'
  | 'PUBLIC_HEALTH';

export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface AutoSuggestionRule {
  category: ComplaintCategory;
  categoryName: string;
  departmentName: string;
  departmentCode: string;
  contactPhone: string;
  contactEmail: string;
  estimatedHours: number;
  timeframeText: string;
  nodalOfficer: string;
  steps: string[];
  safetyAdvice: string;
  iconName: string;
}

export interface AutoSuggestionResult {
  rule: AutoSuggestionRule;
  aiEnrichedNotes?: string;
  detectedKeywords?: string[];
  confidenceScore?: number;
}

export interface ComplaintFeedback {
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Complaint {
  id: string; // e.g. CMP-2026-1042
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  locationText: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedDepartment: string;
  autoSuggestion: {
    department: string;
    contactPhone: string;
    contactEmail: string;
    timeframe: string;
    steps: string[];
    safetyAdvice: string;
    aiAnalysis?: string;
  };
  adminNotes?: string;
  assignedOfficer?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  feedback?: ComplaintFeedback;
}

export interface StatSummary {
  totalComplaints: number;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  rejectedCount: number;
  avgResolutionHours: number;
  satisfactionRate: number;
}

export interface ProjectFile {
  path: string;
  name: string;
  language: 'java' | 'sql' | 'html' | 'json' | 'properties' | 'markdown';
  content: string;
  description: string;
}

export interface VivaQuestion {
  id: number;
  question: string;
  answer: string;
  category: 'Java/Spring' | 'MySQL/SQL' | 'Servlets/JSP' | 'Frontend' | 'Architecture/Security';
}

export interface PptSlide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  speakerNotes: string;
  diagramConcept?: string;
}
