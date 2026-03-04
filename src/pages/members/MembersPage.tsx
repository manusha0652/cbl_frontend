import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Download, ChevronLeft, ChevronRight, Eye, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { memberService } from '../../services/memberService';
import { Modal } from '../../components/modals/Modal';
import type { Member } from '../../types';
import './Members.css';

const DEPARTMENTS = ['All','Finance','IT','HR','Operations','Marketing','Legal','Procurement','Audit','Administration','Engineering'];
const PAGE_SIZE = 10;

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filtered, setFiltered] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await memberService.getAll();
    setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    let result = members;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.employeeId.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q),
      );
    }
    if (dept !== 'All') result = result.filter(m => m.department === dept);
    setFiltered(result);
    setPage(1);
  }, [search, dept, members]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () => {
    const header = 'Employee ID,Name,Department,Gender,Date Joined,Status\n';
    const rows = filtered.map(m =>
      `${m.employeeId},${m.name},${m.department},${m.gender},${m.dateJoined},${m.contributionStatus}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'members.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Members exported successfully');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await memberService.delete(deleteTarget.id);
    setMembers(prev => prev.filter(m => m.id !== deleteTarget.id));
    toast.success(`Member ${deleteTarget.name} deleted`);
    setDeleteTarget(null);
    setDeleting(false);
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Members</h1>
          <p>Manage welfare society membership records</p>
        </div>
        <Link to="/members/new" className="btn btn-primary">
          <UserPlus size={16} /> Add Member
        </Link>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, ID, department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-control"
            style={{ width: 180 }}
            value={dept}
            onChange={e => setDept(e.target.value)}
          >
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={exportCsv}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-400)' }}>
              Loading members...
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Gender</th>
                  <th>Date Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={7}>
                    <div className="empty-state">
                      <p>No members found matching your filters.</p>
                    </div>
                  </td></tr>
                ) : paginated.map(m => (
                  <tr key={m.id}>
                    <td><span className="emp-id">{m.employeeId}</span></td>
                    <td>
                      <div className="member-name-cell">
                        <div className="member-avatar">{m.name[0]}</div>
                        <div>
                          <p className="member-name">{m.name}</p>
                          {m.position && <p className="member-pos">{m.position}</p>}
                        </div>
                      </div>
                    </td>
                    <td>{m.department}</td>
                    <td>
                      <span className={`badge ${m.gender === 'Male' ? 'badge-info' : 'badge-teal'}`}>{m.gender}</span>
                    </td>
                    <td>{new Date(m.dateJoined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <span className={`badge ${m.contributionStatus === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {m.contributionStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <Link to={`/members/${m.id}`} className="btn btn-ghost btn-icon" title="View Profile">
                          <Eye size={15} />
                        </Link>
                        <button className="btn btn-ghost btn-icon" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon"
                          style={{ color: 'var(--color-danger)' }}
                          title="Delete"
                          onClick={() => setDeleteTarget(m)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="pagination">
            <span>Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} members</span>
            <div className="pagination-controls">
              <button className="pg-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button key={p} className={`pg-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                );
              })}
              <button className="pg-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </>
        }
      >
        <div style={{ textAlign: 'center' }}>
          <div className="confirm-dialog-icon">
            <Trash2 size={24} />
          </div>
          <p className="confirm-dialog-title">Delete Member?</p>
          <p className="confirm-dialog-text">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
