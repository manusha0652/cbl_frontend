import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import './Navbar.css';

export function Navbar() {
  const { currentUser, sidebarCollapsed } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header
      className="navbar"
      style={{ left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
    >
      {/* Left */}
      <div className="navbar-left">
        <div className="navbar-search">
          <Search size={15} className="navbar-search-icon" />
          <input type="text" placeholder="Quick search..." />
        </div>
      </div>

      {/* Right */}
      <div className="navbar-right">
        {/* Notification */}
        <button className="navbar-icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        {/* User Menu */}
        <div className="user-menu" ref={dropdownRef}>
          <button
            className="user-menu-trigger"
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">{currentUser.role}</span>
            </div>
            <ChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-avatar user-avatar-lg">{initials}</div>
                <div>
                  <p className="dropdown-name">{currentUser.name}</p>
                  <p className="dropdown-email">{currentUser.email}</p>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item">
                <User size={15} /> My Profile
              </button>
              <button className="dropdown-item">
                <Settings size={15} /> Settings
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item dropdown-item--danger">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
