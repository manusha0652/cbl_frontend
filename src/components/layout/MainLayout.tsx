import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAppContext } from '../../context/AppContext';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarCollapsed } = useAppContext();

  return (
    <div className="app-shell">
      <Sidebar />
      <div
        className={`main-content ${sidebarCollapsed ? 'main-content--collapsed' : ''}`}
      >
        <Navbar />
        <main className="page-wrapper" style={{ marginTop: '64px' }}>
          {children}
        </main>
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} CBL Welfare Society Management System &mdash; All rights reserved.</p>
          <p className="app-footer-sub">Internal Admin System &bull; Powered by <span>CBL Digital</span></p>
        </footer>
      </div>
    </div>
  );
}
