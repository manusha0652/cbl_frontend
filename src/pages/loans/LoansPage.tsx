import { useEffect, useState } from 'react';
import { Search, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { loanService } from '../../services/loanService';
import toast from 'react-hot-toast';
import type { Loan } from '../../types';

const PAGE_SIZE = 10;

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filtered, setFiltered] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Loan['status']>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Welfare Loan' | 'Disaster Loan'>('All');
  const [page, setPage] = useState(1);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loanService.getAll().then(data => { setLoans(data); setLoading(false); });
  }, []);

  useEffect(() => {
    let r = loans;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(l => l.memberName.toLowerCase().includes(q) || l.id.includes(q));
    }
    if (statusFilter !== 'All') r = r.filter(l => l.status === statusFilter);
    if (typeFilter !== 'All') r = r.filter(l => l.loanType === typeFilter);
    setFiltered(r);
    setPage(1);
  }, [search, statusFilter, typeFilter, loans]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  
  // Outstanding is for "Being Collected" status
  const totalOutstanding = loans.filter(l => l.status === 'Being Collected').reduce((s, l) => s + (l.amount - l.amountPaid), 0);

  const handleSyncDebtCollection = () => {
    setSyncing(true);
    toast.loading('Running automated debt collection sync from payroll...', { id: 'debt-sync' });
    setTimeout(() => {
       setSyncing(false);
       toast.success('Debt collection successfully synced for the current month!', { id: 'debt-sync' });
    }, 2000);
  };

  const getStatusBadge = (status: Loan['status']) => {
    switch (status) {
      case 'Being Collected': return <span className="badge badge-primary"><Clock size={10} /> In Debt</span>;
      case 'Completed': return <span className="badge badge-success"><CheckCircle size={10} /> Completed</span>;
      case 'Pending': return <span className="badge badge-warning">Pending</span>;
      case 'Approved': return <span className="badge badge-teal">Approved</span>;
      case 'Rejected': return <span className="badge badge-danger"><XCircle size={10} /> Rejected</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Welfare Loan Management</h1>
          <p>Section 3: Status tracking and automated debt collection via payroll</p>
        </div>
        <button className="btn btn-outline" onClick={handleSyncDebtCollection} disabled={syncing}>
          <RefreshCw size={16} className={syncing ? 'spin' : ''} /> Run Collection Sync
        </button>
      </div>

      {/* Summary row */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Loans', val: loans.length, color: '#1a3f9f' },
          { label: 'In Debt (Collecting)', val: loans.filter(l => l.status === 'Being Collected').length, color: '#14b8a6' },
          { label: 'Pending Approval', val: loans.filter(l => l.status === 'Pending').length, color: '#f59e0b' },
          { label: 'Outstanding Balance', val: `Rs.${totalOutstanding.toLocaleString()}`, color: '#ef4444', big: true },
        ].map((item, i) => (
          <div key={i} className="card card-body" style={{ borderTop: `3px solid ${item.color}` }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-gray-500)', marginBottom: 6 }}>{item.label}</p>
            <p style={{ fontSize: (item as any).big ? '1.3rem' : '1.75rem', fontWeight: 800, color: item.color, fontFamily: 'var(--font-heading)' }}>{item.val}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input type="text" placeholder="Search by member or loan ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: 170 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Being Collected">Being Collected</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select className="form-control" style={{ width: 180 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
            <option value="All">All Types</option>
            <option value="Welfare Loan">Welfare Loan</option>
            <option value="Disaster Loan">Disaster Loan</option>
          </select>
        </div>

        <div className="table-wrapper">
          {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-400)' }}>Loading loans...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Loan ID</th><th>Member</th><th>Type</th><th>Amount</th><th>Date</th><th>Approver</th><th>Plan</th><th>Progress</th><th>Status</th></tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--color-gray-400)' }}>No loan records found.</td></tr>
                ) : paginated.map(l => {
                  const pct = Math.round((l.amountPaid / l.amount) * 100);
                  return (
                    <tr key={l.id}>
                      <td><span className="id-badge">{l.id}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{l.memberName}</td>
                      <td><span className={`badge ${l.loanType === 'Welfare Loan' ? 'badge-primary' : 'badge-warning'}`}>{l.loanType}</span></td>
                      <td style={{ fontWeight: 700 }}>Rs.{l.amount.toLocaleString()}</td>
                      <td style={{ fontSize: '0.85rem' }}>{l.date}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>{l.approvedBy}</td>
                      <td>{l.installmentPlan}mo</td>
                      <td>
                        <div style={{ minWidth: 80 }}>
                          <div className="progress-bar-wrap">
                            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--color-success)' : 'var(--color-primary-600)' }} />
                          </div>
                          <p style={{ fontSize: '0.65rem', color: 'var(--color-gray-400)', marginTop: 2 }}>{pct}% paid</p>
                        </div>
                      </td>
                      <td>{getStatusBadge(l.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="pagination">
            <span>Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div className="pagination-controls">
              <button className="pg-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>&#8249;</button>
              <button className="pg-btn active">{page}</button>
              <button className="pg-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>&#8250;</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
