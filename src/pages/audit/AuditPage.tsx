import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { auditService } from '../../services/auditService';
import type { AuditLog } from '../../types';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await auditService.search(search, dateFrom || undefined, dateTo || undefined);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { void load(); }, [search, dateFrom, dateTo]);

  const MODULE_COLORS: Record<string, string> = {
    Members: 'badge-primary', Loans: 'badge-warning', Contributions: 'badge-teal',
    Reports: 'badge-info', Welfare: 'badge-success', Meetings: 'badge-gray',
    Users: 'badge-danger', System: 'badge-gray', Audit: 'badge-gray',
  };

  return (
    <div>
      <div className="page-header">
        <h1>Audit Logs</h1>
        <p>Track all system activity and user actions</p>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input type="text" placeholder="Search actions, users, records..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="date" className="form-control" placeholder="From" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: 160 }} />
          </div>
          <div className="form-group">
            <input type="date" className="form-control" placeholder="To" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: 160 }} />
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-400)' }}>Loading audit logs...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Action</th><th>Module</th><th>User</th><th>Record</th><th>Date &amp; Time</th><th>IP Address</th></tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={6}><div className="empty-state"><p>No audit logs found.</p></div></td></tr>
                ) : logs.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{l.action}</td>
                    <td><span className={`badge ${MODULE_COLORS[l.module] ?? 'badge-gray'}`}>{l.module}</span></td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-gray-600)' }}>{l.user}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.record}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', whiteSpace: 'nowrap' }}>
                      {new Date(l.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} {new Date(l.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-gray-400)' }}>{l.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
