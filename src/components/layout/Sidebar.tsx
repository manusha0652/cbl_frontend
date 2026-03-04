import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  BarChart3,
  Heart,
  FileText,
  UserCog,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  LogOut,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import './Sidebar.css';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/members', label: 'Members', icon: <Users size={20} /> },
  { path: '/contributions', label: 'Contributions', icon: <DollarSign size={20} /> },
  { path: '/loans', label: 'Loans', icon: <CreditCard size={20} /> },
  { path: '/donations', label: 'Donations', icon: <Heart size={20} /> },
  { path: '/reports', label: 'Reports', icon: <BarChart3 size={20} /> },
  { path: '/welfare', label: 'Welfare Programs', icon: <Activity size={20} /> },
  { path: '/meetings', label: 'Meetings', icon: <FileText size={20} /> },
  { path: '/users', label: 'Users & Roles', icon: <UserCog size={20} /> },
  { path: '/audit', label: 'Audit Logs', icon: <ScrollText size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand" onClick={() => navigate('/dashboard')}>
          <div className="logo-box"><Building2 size={24} /></div>
          {!sidebarCollapsed && <span>CBL WSMS</span>}
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <div className="nav-icon">{item.icon}</div>
            {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout} title={sidebarCollapsed ? 'Logout' : undefined}>
          <div className="nav-icon" style={{ color: 'var(--color-danger)' }}><LogOut size={20} /></div>
          {!sidebarCollapsed && <span className="nav-label" style={{ color: 'var(--color-danger)' }}>Logout</span>}
        </button>
      </div>
    </div>
  );
}
