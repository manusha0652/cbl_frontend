import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, CreditCard, Heart, AlertTriangle,
  User2, Mail, Phone, Building2, Calendar, CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { memberService } from '../../services/memberService';
import { loanService } from '../../services/loanService';
import { Modal } from '../../components/modals/Modal';
import type { Member, Loan } from '../../types';
import './MemberProfile.css';

const EMPTY_LOAN: Omit<Loan, 'id' | 'memberId' | 'memberName' | 'amountPaid'> = {
  loanType: 'Welfare Loan',
  amount: 0,
  date: '',
  approvedBy: '',
  installmentPlan: 12,
  status: 'Being Collected',
};

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanForm, setLoanForm] = useState(EMPTY_LOAN);
  const [submitting, setSubmitting] = useState(false);
  const [loanErrors, setLoanErrors] = useState<Partial<typeof EMPTY_LOAN>>({});

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const [m, l] = await Promise.all([
        memberService.getById(id),
        loanService.getByMemberId(id),
      ]);
      setMember(m ?? null);
      setLoans(l);
      setLoading(false);
    };
    void load();
  }, [id]);

  const totalLoans = loans.reduce((s, l) => s + l.amount, 0);
  const outstanding = loans.filter(l => l.status === 'Being Collected').reduce((s, l) => s + (l.amount - l.amountPaid), 0);

  const validateLoan = () => {
    const errs: Partial<typeof EMPTY_LOAN> = {};
    if (!loanForm.amount || loanForm.amount <= 0) errs.amount = 0;
    if (!loanForm.date) errs.date = '';
    if (!loanForm.approvedBy) errs.approvedBy = '';
    setLoanErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddLoan = async () => {
    if (!member || !validateLoan()) return;
    setSubmitting(true);
    try {
      const newLoan = await loanService.create({
        ...loanForm,
        memberId: member.id,
        memberName: member.name,
        amountPaid: 0,
      });
      setLoans(prev => [newLoan, ...prev]);
      setShowLoanModal(false);
      setLoanForm(EMPTY_LOAN);
      toast.success('Loan added successfully');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-400)' }}>
        Loading member profile...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="empty-state">
        <p>Member not found.</p>
        <Link to="/members" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Members</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back */}
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back to Members
        </button>
      </div>

      {/* Profile Header */}
      <div className="profile-header card" style={{ marginBottom: 20 }}>
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
        </div>
        <div className="profile-info">
          <div className="profile-title-row">
            <h2>{member.name}</h2>
            <span className={`badge ${member.contributionStatus === 'Active' ? 'badge-success' : 'badge-danger'}`}>
              {member.contributionStatus}
            </span>
          </div>
          <div className="profile-meta-grid">
            <div className="profile-meta-item"><User2 size={14} /><span>{member.employeeId}</span></div>
            <div className="profile-meta-item"><Building2 size={14} /><span>{member.department}</span></div>
            <div className="profile-meta-item"><User2 size={14} /><span>{member.gender}</span></div>
            <div className="profile-meta-item"><Calendar size={14} /><span>Joined: {new Date(member.dateJoined).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
            {member.email && <div className="profile-meta-item"><Mail size={14} /><span>{member.email}</span></div>}
            {member.phone && <div className="profile-meta-item"><Phone size={14} /><span>{member.phone}</span></div>}
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn btn-primary" onClick={() => setShowLoanModal(true)}>
            <Plus size={15} /> Add Loan
          </button>
          <button className="btn btn-outline" onClick={() => toast('Feature coming soon')}>
            <Heart size={15} /> Death Donation
          </button>
          <button className="btn btn-outline" onClick={() => toast('Feature coming soon')}>
            <AlertTriangle size={15} /> Disaster Loan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="two-col-grid" style={{ marginBottom: 20 }}>
        <div className="card card-body">
          <div className="loan-stat"><CreditCard size={20} className="loan-stat-icon" /><div><p className="loan-stat-label">Total Loans Taken</p><p className="loan-stat-value">Rs.{totalLoans.toLocaleString()}</p></div></div>
        </div>
        <div className="card card-body">
          <div className="loan-stat"><CheckCircle2 size={20} className="loan-stat-icon danger" /><div><p className="loan-stat-label">Outstanding Balance</p><p className="loan-stat-value" style={{ color: 'var(--color-danger)' }}>Rs.{outstanding.toLocaleString()}</p></div></div>
        </div>
      </div>

      {/* Loan history */}
      <div className="card">
        <div className="card-header">
          <h3>Welfare Benefits History</h3>
          <span className="badge badge-primary">{loans.length} records</span>
        </div>
        <div className="table-wrapper">
          {loans.length === 0 ? (
            <div className="empty-state"><p>No loan or benefit records found for this member.</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Approved By</th>
                  <th>Installments</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(l => {
                  const pct = Math.round((l.amountPaid / l.amount) * 100);
                  return (
                    <tr key={l.id}>
                      <td><span className={`badge ${l.loanType === 'Welfare Loan' ? 'badge-primary' : 'badge-warning'}`}>{l.loanType}</span></td>
                      <td>Rs.{l.amount.toLocaleString()}</td>
                      <td>{new Date(l.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{l.approvedBy}</td>
                      <td>{l.installmentPlan} months</td>
                      <td>
                        <div style={{ minWidth: 100 }}>
                          <div className="progress-bar-wrap">
                            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--color-success)' : 'var(--color-primary-600)' }} />
                          </div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)', marginTop: 3 }}>{pct}% paid</p>
                        </div>
                      </td>
                      <td><span className={`badge ${['Being Collected', 'Approved'].includes(l.status) ? 'badge-warning' : l.status === 'Completed' ? 'badge-success' : 'badge-danger'}`}>{l.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Loan Modal */}
      <Modal
        isOpen={showLoanModal}
        onClose={() => { setShowLoanModal(false); setLoanForm(EMPTY_LOAN); setLoanErrors({}); }}
        title="Add Loan"
        size="md"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowLoanModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddLoan} disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Loan'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Loan Type <span className="required">*</span></label>
          <select className="form-control" value={loanForm.loanType} onChange={e => setLoanForm(p => ({ ...p, loanType: e.target.value as Loan['loanType'] }))}>
            <option value="Welfare Loan">Welfare Loan</option>
            <option value="Disaster Loan">Disaster Loan</option>
          </select>
        </div>
        <div className="form-row" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label className="form-label">Amount (Rs.) <span className="required">*</span></label>
            <input type="number" className={`form-control ${loanErrors.amount !== undefined ? 'error' : ''}`} placeholder="e.g. 500000" value={loanForm.amount || ''} onChange={e => setLoanForm(p => ({ ...p, amount: Number(e.target.value) }))} />
            {loanErrors.amount !== undefined && <p className="form-error">Amount is required</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Date <span className="required">*</span></label>
            <input type="date" className={`form-control ${loanErrors.date !== undefined ? 'error' : ''}`} value={loanForm.date} onChange={e => setLoanForm(p => ({ ...p, date: e.target.value }))} />
            {loanErrors.date !== undefined && <p className="form-error">Date is required</p>}
          </div>
        </div>
        <div className="form-row" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label className="form-label">Approved By <span className="required">*</span></label>
            <input type="text" className={`form-control ${loanErrors.approvedBy !== undefined ? 'error' : ''}`} placeholder="Approver name" value={loanForm.approvedBy} onChange={e => setLoanForm(p => ({ ...p, approvedBy: e.target.value }))} />
            {loanErrors.approvedBy !== undefined && <p className="form-error">Approver is required</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Installment Plan</label>
            <select className="form-control" value={loanForm.installmentPlan} onChange={e => setLoanForm(p => ({ ...p, installmentPlan: Number(e.target.value) }))}>
              {[3, 6, 12, 18, 24].map(n => <option key={n} value={n}>{n} months</option>)}
            </select>
          </div>
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label">Status</label>
          <select className="form-control" value={loanForm.status} onChange={e => setLoanForm(p => ({ ...p, status: e.target.value as Loan['status'] }))}>
            <option value="Being Collected">Being Collected</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
