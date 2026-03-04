import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, Chrome, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your credentials');
      return;
    }
    setLoading(true);
    // Simulate auth
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Welcome back, Admin!');
      navigate('/dashboard');
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Successfully logged in with Google');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="login-container">
      {/* Left side: branding/visual */}
      <div className="login-visual">
        <div className="visual-content">
          <div className="brand-badge">
            <ShieldCheck size={18} /> CBL Welfare Society
          </div>
          <h1 className="brand-headline">Managing Welfare with Precision & Care</h1>
          <p className="brand-subtext">
            Enterprise-grade management system for the CBL Welfare Society, supporting over 1,500 employees with digitized loans, contributions, and community support.
          </p>
          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-dot" /> <span>Automated Payroll Integration</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot" /> <span>Transparent Audit Logs</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot" /> <span>Real-time Financial Analytics</span>
            </div>
          </div>
        </div>
        <div className="login-footer-tag">
          &copy; 2026 CBL Digital Solutions
        </div>
      </div>

      {/* Right side: login form */}
      <div className="login-panel">
        <div className="login-box">
          <div className="login-header">
            <div className="logo-square">
              <Building2 size={28} />
            </div>
            <h2>Internal Login</h2>
            <p>Access the WSMS Admin Dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleManualLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="admin@cbl.gov.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label className="form-label">Password</label>
                <a href="#" className="forgot-link">Forgot?</a>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-login" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button type="button" className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
              <Chrome size={20} /> Continue with Google
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <a href="#" onClick={() => toast('Self-registration is disabled. Contact HR for access.')}>Contact Admin</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
