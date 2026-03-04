import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { DashboardStats, DashboardFilter, AppUser } from '../types';

// ─── Context Types ───────────────────────────────
interface AppContextType {
  currentUser: AppUser;
  dashboardFilter: DashboardFilter;
  setDashboardFilter: (filter: DashboardFilter) => void;
  dashboardStats: DashboardStats;
  setDashboardStats: (stats: DashboardStats) => void;
  refreshDashboard: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

// ─── Default Values ──────────────────────────────
const defaultUser: AppUser = {
  id: 'usr-001',
  name: 'Musa Usman',
  email: 'musa.usman@cbl.gov.ng',
  role: 'SuperAdmin',
  department: 'Administration',
  status: 'Active',
  lastLogin: new Date().toISOString(),
  createdAt: '2018-01-10',
};

const defaultStats: DashboardStats = {
  totalMembers: 0,
  totalMaleMembers: 0,
  totalFemaleMembers: 0,
  totalContributionMonth: 0,
  totalOutstandingLoans: 0,
  totalDeathDonations: 0,
  totalDisasterLoans: 0,
  totalAmountPaid: 0,
};

const now = new Date();
const defaultFilter: DashboardFilter = {
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  state: 'All',
};

// ─── Context ─────────────────────────────────────
const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser] = useState<AppUser>(defaultUser);
  const [dashboardFilter, setDashboardFilter] = useState<DashboardFilter>(defaultFilter);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(defaultStats);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const refreshDashboard = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  // Expose refreshKey via filter so child components can react to refresh
  const filterWithRefresh = { ...dashboardFilter, _refreshKey: refreshKey } as DashboardFilter & { _refreshKey: number };

  return (
    <AppContext.Provider value={{
      currentUser,
      dashboardFilter: filterWithRefresh,
      setDashboardFilter,
      dashboardStats,
      setDashboardStats,
      refreshDashboard,
      sidebarCollapsed,
      toggleSidebar,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────
export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
