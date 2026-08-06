import React, { useState, useEffect } from 'react';
import { User, Complaint, ComplaintStatus } from './types';
import { INITIAL_COMPLAINTS } from './data/mockComplaints';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ComplaintModal } from './components/ComplaintModal';
import { HomeView } from './views/HomeView';
import { ReportIssueView } from './views/ReportIssueView';
import { MyComplaintsView } from './views/MyComplaintsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { DeliverablesView } from './views/DeliverablesView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'report' | 'my-complaints' | 'admin' | 'deliverables'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr-101',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'USER',
    createdAt: new Date().toISOString()
  });

  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedComplaintModal, setSelectedComplaintModal] = useState<Complaint | null>(null);

  // Fetch complaints from Express Backend API
  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints');
      const data = await res.json();
      if (data.success && Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      }
    } catch (err) {
      console.warn('Backend API connection fallback to local state:', err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handler when a new complaint is submitted
  const handleComplaintCreated = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  // Handler for Admin updating complaint status
  const handleUpdateStatus = async (
    complaintId: string,
    status: ComplaintStatus,
    adminNotes: string,
    officerName: string
  ) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes, assignedOfficer: officerName })
      });
      const data = await res.json();

      if (data.success && data.complaint) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === complaintId ? data.complaint : c))
        );
      } else {
        // Fallback state update
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === complaintId
              ? {
                  ...c,
                  status,
                  adminNotes,
                  assignedOfficer: officerName,
                  updatedAt: new Date().toISOString(),
                  resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : c.resolvedAt
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Handler for Citizen submitting feedback
  const handleSubmitFeedback = async (complaintId: string, rating: number, comment: string) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();

      if (data.success && data.complaint) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === complaintId ? data.complaint : c))
        );
      } else {
        // Fallback state update
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === complaintId
              ? {
                  ...c,
                  feedback: {
                    rating,
                    comment,
                    createdAt: new Date().toISOString()
                  }
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  // Demo Switchers
  const switchToAdmin = () => {
    setCurrentUser({
      id: 'usr-admin',
      name: 'System Administrator',
      email: 'admin@civic.gov.in',
      phone: '+91 98765 43210',
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    });
    setCurrentTab('admin');
  };

  const switchToUser = () => {
    setCurrentUser({
      id: 'usr-101',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      role: 'USER',
      createdAt: new Date().toISOString()
    });
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onSwitchToAdmin={switchToAdmin}
        onSwitchToUser={switchToUser}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && (
          <HomeView
            complaints={complaints}
            onNavigateReport={() => setCurrentTab('report')}
            onNavigateDeliverables={() => setCurrentTab('deliverables')}
            onSelectComplaint={(c) => setSelectedComplaintModal(c)}
          />
        )}

        {currentTab === 'report' && (
          <ReportIssueView
            currentUser={currentUser}
            onComplaintCreated={handleComplaintCreated}
            onNavigateHistory={() => setCurrentTab('my-complaints')}
          />
        )}

        {currentTab === 'my-complaints' && (
          <MyComplaintsView
            currentUser={currentUser}
            complaints={complaints}
            onNavigateReport={() => setCurrentTab('report')}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView
            complaints={complaints}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {currentTab === 'deliverables' && <DeliverablesView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'ADMIN') setCurrentTab('admin');
        }}
      />

      {/* General Detail Modal */}
      {selectedComplaintModal && (
        <ComplaintModal
          complaint={selectedComplaintModal}
          onClose={() => setSelectedComplaintModal(null)}
          isAdmin={currentUser?.role === 'ADMIN'}
          onUpdateStatus={handleUpdateStatus}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
    </div>
  );
}
