import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';

// Public components & pages
import { PublicLayout } from './components/public/PublicLayout.js';
import { Home } from './pages/public/Home.js';
import { AboutPage } from './pages/public/AboutPage.js';
import { MembersPage } from './pages/public/MembersPage.js';
import { MonthlyPage } from './pages/public/MonthlyPage.js';
import { EventsPage } from './pages/public/EventsPage.js';
import { ExpensesPage } from './pages/public/ExpensesPage.js';
import { MeetingsPage } from './pages/public/MeetingsPage.js';
import { GalleryPage } from './pages/public/GalleryPage.js';
import { ContactPage } from './pages/public/ContactPage.js';

// Admin components & pages
import { AdminLayout } from './components/admin/AdminLayout.js';
import { AdminLogin } from './pages/admin/AdminLogin.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { AdminMembers } from './pages/admin/AdminMembers.js';
import { AdminMonthlyContributions } from './pages/admin/AdminMonthlyContributions.js';
import { AdminFestivalContributions } from './pages/admin/AdminFestivalContributions.js';
import { AdminEvents } from './pages/admin/AdminEvents.js';
import { AdminExpenses } from './pages/admin/AdminExpenses.js';
import { AdminMeetings } from './pages/admin/AdminMeetings.js';
import { AdminReports } from './pages/admin/AdminReports.js';
import { AdminSettings } from './pages/admin/AdminSettings.js';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs.js';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marathi Portal */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="monthly-contributions" element={<MonthlyPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Management Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="monthly-contributions" element={<AdminMonthlyContributions />} />
            <Route path="festival-contributions" element={<AdminFestivalContributions />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="expenses" element={<AdminExpenses />} />
            <Route path="meetings" element={<AdminMeetings />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
