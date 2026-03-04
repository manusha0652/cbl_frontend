import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';

// Lazy load pages
import DashboardPage     from '../pages/dashboard/DashboardPage';
import MembersPage       from '../pages/members/MembersPage';
import MemberProfilePage from '../pages/members/MemberProfilePage';
import MemberRegistrationPage from '../pages/members/MemberRegistrationPage';
import ContributionsPage from '../pages/contributions/ContributionsPage';
import LoansPage         from '../pages/loans/LoansPage';
import ReportsPage       from '../pages/reports/ReportsPage';
import WelfarePage       from '../pages/welfare/WelfarePage';
import MeetingsPage      from '../pages/meetings/MeetingsPage';
import UsersPage         from '../pages/users/UsersPage';
import AuditPage         from '../pages/audit/AuditPage';
import SettingsPage      from '../pages/settings/SettingsPage';
import LoginPage         from '../pages/login/LoginPage';
import DonationsPage     from '../pages/welfare/DonationsPage';

// ─── Route Protection ────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
        <Route path="/members/:id" element={<ProtectedRoute><MemberProfilePage /></ProtectedRoute>} />
        <Route path="/members/new" element={<ProtectedRoute><MemberRegistrationPage /></ProtectedRoute>} />
        <Route path="/contributions" element={<ProtectedRoute><ContributionsPage /></ProtectedRoute>} />
        <Route path="/loans"        element={<ProtectedRoute><LoansPage /></ProtectedRoute>} />
        <Route path="/donations"    element={<ProtectedRoute><DonationsPage /></ProtectedRoute>} />
        <Route path="/reports"      element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/welfare" element={<ProtectedRoute><WelfarePage /></ProtectedRoute>} />
        <Route path="/meetings" element={<ProtectedRoute><MeetingsPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AuditPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
