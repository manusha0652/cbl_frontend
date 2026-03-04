import { useState, useEffect } from 'react';
import { UserPlus, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';
import type { AppUser, Permission } from '../../types';

export default function UsersPage() {
  const [tab, setTab] = useState<'users' | 'permissions'>('users');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userService.getAll(), userService.getPermissions()]).then(([u, p]) => {
      setUsers(u);
      setPermissions(p);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (module: string, role: keyof Omit<Permission, 'module'>, value: boolean) => {
    await userService.updatePermission(module, role, value);
    setPermissions(prev => prev.map(p => p.module === module ? { ...p, [role]: value } : p));
    toast.success(`Permission updated`);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: value ? 'var(--color-teal-600)' : 'var(--color-gray-300)', display: 'flex', alignItems: 'center' }}
      aria-label={value ? 'Enabled' : 'Disabled'}
    >
      {value ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
  );

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Users &amp; Roles</h1>
          <p>Manage admin users and permission matrix</p>
        </div>
        <button className="btn btn-primary" onClick={() => toast('Add user coming soon')}>
          <UserPlus size={15} /> Add User
        </button>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>User Accounts</button>
        <button className={`tab-btn ${tab === 'permissions' ? 'active' : ''}`} onClick={() => setTab('permissions')}>Permission Matrix</button>
      </div>

      {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-400)' }}>Loading...</div> : (
        <>
          {tab === 'users' && (
            <div className="card">
              <div className="card-header"><h3>Admin Users <span className="badge badge-primary">{users.length}</span></h3></div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Last Login</th><th>Status</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-teal-500))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                              {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--color-gray-500)', fontSize: '0.8125rem' }}>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === 'SuperAdmin' ? 'badge-danger' : u.role === 'WelfareAdmin' ? 'badge-primary' : 'badge-gray'}`}>
                            <Shield size={10} /> {u.role}
                          </span>
                        </td>
                        <td>{u.department}</td>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>{new Date(u.lastLogin).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td><span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'permissions' && (
            <div className="card">
              <div className="card-header"><h3>Module Permission Matrix</h3></div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th style={{ textAlign: 'center' }}>SuperAdmin</th>
                      <th style={{ textAlign: 'center' }}>WelfareAdmin</th>
                      <th style={{ textAlign: 'center' }}>Viewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map(p => (
                      <tr key={p.module}>
                        <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{p.module}</td>
                        <td style={{ textAlign: 'center' }}>
                          <Toggle value={p.superAdmin} onChange={v => handleToggle(p.module, 'superAdmin', v)} />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Toggle value={p.welfareAdmin} onChange={v => handleToggle(p.module, 'welfareAdmin', v)} />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Toggle value={p.viewer} onChange={v => handleToggle(p.module, 'viewer', v)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
