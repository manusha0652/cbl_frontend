import React, { useEffect, useState } from 'react';
import { Search, Plus, Filter, Heart } from 'lucide-react';
import { donationService } from '../../services/donationService';
import { Modal } from '../../components/modals/Modal';
import toast from 'react-hot-toast';
import type { DeathDonation } from '../../types';

const PAGE_SIZE = 10;

export default function DonationsPage() {
  const [donations, setDonations] = useState<DeathDonation[]>([]);
  const [filtered, setFiltered] = useState<DeathDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    donationService.getAll().then(data => { setDonations(data); setLoading(false); });
  }, []);

  useEffect(() => {
    let r = donations;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(d => d.memberName.toLowerCase().includes(q) || d.deceased.toLowerCase().includes(q));
    }
    if (statusFilter !== 'All') r = r.filter(d => d.status === statusFilter);
    setFiltered(r);
    setPage(1);
  }, [search, statusFilter, donations]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await donationService.update(id, { status, approvedBy: 'SuperAdmin' });
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status, approvedBy: 'SuperAdmin' } : d));
      toast.success(`Donation ${status.toLowerCase()} successfully`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Death Donations</h1>
          <p>Section 4: Management and tracking of welfare death support donations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Log Donation
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Logs', val: donations.length, color: 'var(--color-primary-700)' },
          { label: 'Pending Approval', val: donations.filter(d => d.status === 'Pending').length, color: 'var(--color-warning-dark)' },
          { label: 'Total Approved', val: donations.filter(d => d.status === 'Approved').length, color: 'var(--color-success-dark)' },
          { label: 'Total Amount Disbursed', val: `Rs.${donations.filter(d => d.status === 'Approved').reduce((s,d) => s + d.amount, 0).toLocaleString()}`, color: 'var(--color-teal-600)', big: true },
        ].map((item, i) => (
          <div key={i} className="card card-body" style={{ borderTop: `3px solid ${item.color}` }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gray-500)', marginBottom: 6 }}>{item.label}</p>
            <p style={{ fontSize: (item as any).big ? '1.3rem' : '1.75rem', fontWeight: 800, color: item.color, fontFamily: 'var(--font-heading)' }}>{item.val}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input type="text" placeholder="Search member or deceased..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="filter-group">
              <Filter size={15} />
              <select className="form-control-ghost" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-400)' }}>Loading...</div> : (
            <table className="data-table">
              <thead>
                <tr><th>Log ID</th><th>Member</th><th>Deceased</th><th>Relationship</th><th>Amount</th><th>Date</th><th>Approved By</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {paginated.map(d => (
                  <tr key={d.id}>
                    <td><span className="id-badge">{d.id}</span></td>
                    <td style={{ fontWeight: 600 }}>{d.memberName}</td>
                    <td>{d.deceased}</td>
                    <td style={{ fontSize: '0.85rem' }}>{d.relationship}</td>
                    <td style={{ fontWeight: 700 }}>Rs.{d.amount.toLocaleString()}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(d.date).toLocaleDateString()}</td>
                    <td style={{ color: 'var(--color-gray-500)' }}>{d.approvedBy}</td>
                    <td><span className={`badge ${d.status === 'Approved' ? 'badge-success' : d.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>{d.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {d.status === 'Pending' && (
                          <>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-success)' }} onClick={() => handleUpdateStatus(d.id, 'Approved')}>Approve</button>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleUpdateStatus(d.id, 'Rejected')}>Reject</button>
                          </>
                        )}
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => toast('View details coming soon')} title="View Details"><Heart size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="pagination">
            <span>Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} logs</span>
            <div className="pagination-controls">
              <button className="pg-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>&#8249;</button>
              <button className="pg-btn active">{page}</button>
              <button className="pg-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>&#8250;</button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Donation Record" size="md">
        <div style={{ padding: 10, color: 'var(--color-gray-500)', textAlign: 'center' }}>
          <Heart size={40} style={{ margin: '0 auto 16px', color: 'var(--color-primary-200)' }} />
          <p>Logging functionality is being aligned with the welfare database...</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowModal(false)}>Got it</button>
        </div>
      </Modal>
    </div>
  );
}
