import { useState, useEffect } from 'react';
import { Database, RefreshCw, Layers, Percent, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';
import type { BackupInfo } from '../../types';

export default function SettingsPage() {
  const [backup, setBackup] = useState<BackupInfo | null>(null);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Interest rate settings (Mock state)
  const [loanInterest, setLoanInterest] = useState('5.0');
  const [disasterInterest, setDisasterInterest] = useState('2.5');

  useEffect(() => {
    userService.getBackupInfo().then(b => { setBackup(b); setLoading(false); });
  }, []);

  const handleBackup = async () => {
    setRunning(true);
    toast.loading('Running backup...', { id: 'backup' });
    const b = await userService.runBackup();
    setBackup(b);
    setRunning(false);
    toast.success('Backup completed successfully!', { id: 'backup' });
  };

  const handleSaveInterest = () => {
    toast.success('Interest rates updated successfully');
  };

  return (
    <div>
      <div className="page-header">
        <h1>System Settings</h1>
        <p>Manage application configuration, interest rates, and backups</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        
        {/* 1. Loan Category & Interest Rate Settings (Requirement 3) */}
        <div className="card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, background: 'var(--color-warning-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning-dark)' }}>
              <Percent size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-gray-900)' }}>Interest Rate Settings</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Configure global loan interest rates</p>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Welfare Loan Interest Rate (%)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="number" className="form-control" value={loanInterest} onChange={e => setLoanInterest(e.target.value)} step="0.1" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-gray-400)' }}>% p.a</span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Disaster Loan Interest Rate (%)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="number" className="form-control" value={disasterInterest} onChange={e => setDisasterInterest(e.target.value)} step="0.1" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-gray-400)' }}>% p.a</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleSaveInterest}>
            Save Interest Config
          </button>
        </div>

        {/* 2. RBAC Summary (Requirement 1) */}
        <div className="card card-body">
           <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, background: 'var(--color-primary-50)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-700)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-gray-900)' }}>Role-Based Access Control</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Manage system access levels</p>
            </div>
          </div>

          <div className="p-4" style={{ background: 'var(--color-gray-50)', borderRadius: 12, marginBottom: 16 }}>
             <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-gray-800)', marginBottom: 10 }}>Global Security Status</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { r: 'SuperAdmin', p: 'Full Access' },
                  { r: 'Welfare Admin', p: 'Loans, Donations, Members' },
                  { r: 'Finance Admin', p: 'Contributions & Reports' }
                ].map(item => (
                   <div key={item.r} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: 700 }}>{item.r}</span>
                      <span style={{ color: 'var(--color-teal-600)' }}>{item.p}</span>
                   </div>
                ))}
             </div>
          </div>
          
          <button className="btn btn-outline w-full" onClick={() => window.location.href='/users'}>
            Manage Permissions Matrix
          </button>
        </div>

        {/* 3. Backup Management */}
        <div className="card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, background: 'var(--color-teal-50)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-teal-600)' }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-gray-900)' }}>Data Backup</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>System snapshots and manual recovery</p>
            </div>
          </div>

          {loading ? <div style={{ color: 'var(--color-gray-400)', fontSize: '0.875rem' }}>Loading backup info...</div> : backup && (
            <div style={{ background: 'var(--color-gray-50)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Last Successful Backup</p>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-gray-900)' }}>
                    {new Date(backup.lastBackupDate).toLocaleDateString()} at {new Date(backup.lastBackupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Size</p>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-gray-900)' }}>{backup.lastBackupSize}</p>
                </div>
              </div>
            </div>
          )}

          <button className="btn btn-primary w-full" onClick={handleBackup} disabled={running}>
            <RefreshCw size={15} className={running ? 'spin' : ''} style={{ marginRight: 8 }} />
            {running ? 'Running Backup...' : 'Execute Manual Backup'}
          </button>
        </div>

        {/* 4. System Info */}
        <div className="card card-body">
           <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, background: 'var(--color-gray-100)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-700)' }}>
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-gray-900)' }}>Application Status</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Version and environment info</p>
            </div>
          </div>
          {[
            ['Application Version', '1.0.0-PROD'],
            ['Organization', 'CBL Welfare Society'],
            ['Audit Log Status', 'Active & Logging'],
            ['Payroll Connection', 'Simulated Secure'],
            ['Environment', 'Production-ready Mock'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-gray-50)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--color-gray-500)' }}>{label}</span>
              <span style={{ color: 'var(--color-gray-900)', fontWeight: 700 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
