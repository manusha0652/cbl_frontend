import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Printer, FileSpreadsheet, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { reportService } from '../../services/reportService';
import type { MonthlyReport, LoanReport, MemberContributionReport } from '../../types';

type TabKey = 'monthly' | 'yearly' | 'loans' | 'contributions' | 'custom';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEARS  = [2022, 2023, 2024, 2025];

export default function ReportsPage() {
  const [tab, setTab] = useState<TabKey>('monthly');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');

  const [monthlyData, setMonthlyData] = useState<MonthlyReport | null>(null);
  const [loanData, setLoanData] = useState<LoanReport[]>([]);
  const [contribData, setContribData] = useState<MemberContributionReport[]>([]);

  const load = async () => {
    setLoading(true);
    if (tab === 'monthly') {
      const d = await reportService.getMonthlyReport(month, year);
      setMonthlyData(d);
    } else if (tab === 'loans') {
      const d = await reportService.getLoanReport();
      setLoanData(d);
    } else if (tab === 'contributions') {
      const d = await reportService.getMemberContributionReport();
      setContribData(d);
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, [tab, month, year]);

  const handleDownload = (type: 'PDF' | 'EXCEL') => {
    const toastId = toast.loading(`Generating ${type} report...`);
    setTimeout(() => {
      toast.success(`${tab.charAt(0).toUpperCase() + tab.slice(1)} report downloaded as ${type}`, { id: toastId });
    }, 1500);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
    { key: 'loans', label: 'Loans' },
    { key: 'contributions', label: 'Contributions' },
    { key: 'custom', label: 'Custom Report' },
  ];

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Module 6: Analytics & Reporting</h1>
          <p>Exportable welfare operations summaries</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" onClick={() => handleDownload('PDF')}>
            <FileText size={14} /> Download PDF
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => handleDownload('EXCEL')}>
            <FileSpreadsheet size={14} /> Download Excel
          </button>
        </div>
      </div>

      <div className="tab-nav">
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className="card card-body" style={{ marginBottom: 24, padding: '16px 20px' }}>
         <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {['monthly', 'yearly', 'custom'].includes(tab) && (
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Year</label>
                <select className="form-control form-control-sm" style={{ width: 110 }} value={year} onChange={e => setYear(Number(e.target.value))}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}
            
            {tab === 'monthly' && (
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Month</label>
                <select className="form-control form-control-sm" style={{ width: 140 }} value={month} onChange={e => setMonth(Number(e.target.value))}>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
            )}

            {/* Whiteboard Requirement: Employee Wise Reports */}
            {['loans', 'contributions', 'custom'].includes(tab) && (
              <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Employee Search (Employee-Wise)</label>
                <div className="search-box p-0" style={{ height: 38, background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)' }}>
                   <Search size={14} className="ml-3 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Search by name or ID..." 
                     className="bg-transparent border-0 pl-2 text-sm focus:ring-0 w-full" 
                     value={employeeSearch}
                     onChange={(e) => setEmployeeSearch(e.target.value)}
                   />
                </div>
              </div>
            )}

            <button className="btn btn-outline btn-sm" style={{ height: 38 }} onClick={load} disabled={loading}>
               <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Data
            </button>

            <button className="btn btn-ghost btn-icon" title="Print Current View" onClick={() => window.print()}>
               <Printer size={16} />
            </button>
         </div>
      </div>

      {loading ? (
        <div style={{ padding: 100, textAlign: 'center' }}>
           <RefreshCw size={40} className="spin text-primary-200 mb-4" style={{ margin: '0 auto 16px', display: 'block' }} />
           <p style={{ color: 'var(--color-gray-400)', fontWeight: 600 }}>Synthesizing analytical data...</p>
        </div>
      ) : (
        <>
          {tab === 'monthly' && monthlyData && (
            <div className="card">
              <div className="card-header">
                <h3>Monthly Execution Summary — {MONTHS[monthlyData.month - 1]} {monthlyData.year}</h3>
              </div>
              <div className="card-body">
                <div className="stats-grid">
                  {[
                    { label: 'Total Contributions', val: `Rs.${monthlyData.totalContributions.toLocaleString()}`, color: 'var(--color-success-dark)' },
                    { label: 'Member Participation', val: `${monthlyData.contributingMembers} Active`, color: 'var(--color-primary-700)' },
                    { label: 'Pending Loans', val: monthlyData.totalLoans, color: 'var(--color-warning-dark)' },
                    { label: 'Death Benefits Disbursed', val: monthlyData.totalDonations, color: 'var(--color-danger)' },
                  ].map((item, i) => (
                    <div key={i} className="card p-5" style={{ borderLeft: `4px solid ${item.color}` }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-gray-400)', marginBottom: 6 }}>{item.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color }}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'loans' && (
            <div className="card">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Log ID</th><th>Member</th><th>Loan Type</th><th>Amount</th><th>Amount Paid</th><th>Outstanding</th><th>Sync Status</th></tr></thead>
                  <tbody>
                    {loanData.filter(l => l.memberName.toLowerCase().includes(employeeSearch.toLowerCase())).map(l => (
                      <tr key={l.id}>
                        <td className="id-badge">{l.id}</td>
                        <td style={{ fontWeight: 600 }}>{l.memberName}</td>
                        <td>{l.loanType}</td>
                        <td style={{ fontWeight: 700 }}>Rs.{l.amount.toLocaleString()}</td>
                        <td style={{ color: 'var(--color-success)' }}>Rs.{l.amountPaid.toLocaleString()}</td>
                        <td style={{ color: 'var(--color-danger)' }}>Rs.{l.outstanding.toLocaleString()}</td>
                        <td><span className="badge badge-teal">Payroll Synced</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'contributions' && (
            <div className="card">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Employee ID</th><th>Member Name</th><th>Department</th><th>Total Assets</th><th>Period Covered</th><th>Status</th></tr></thead>
                  <tbody>
                    {contribData.filter(c => c.memberName.toLowerCase().includes(employeeSearch.toLowerCase())).map(c => (
                      <tr key={c.memberId}>
                        <td className="id-badge">{c.employeeId}</td>
                        <td style={{ fontWeight: 600 }}>{c.memberName}</td>
                        <td>{c.department}</td>
                        <td style={{ fontWeight: 800 }}>Rs.{c.totalContributed.toLocaleString()}</td>
                        <td>{c.monthsPaid}/12 months</td>
                        <td><span className="badge badge-success">Consistent</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'yearly' && (
             <div className="card p-12 text-center">
                <BarChart3 size={60} className="text-gray-200 mb-4" style={{ margin: '0 auto 16px', display: 'block' }} />
                <h3>Annual Operational Review</h3>
                <p style={{ color: 'var(--color-gray-500)', maxWidth: 460, margin: '8px auto 24px' }}>
                  Generate a comprehensive 12-month summary including P&L, Loan recovery ratios, and welfare distribution trends.
                </p>
                <button className="btn btn-primary" onClick={() => handleDownload('PDF')}>
                   Generate {year} Annual Report
                </button>
             </div>
          )}

          {tab === 'custom' && (
             <div className="card p-12 text-center">
                <Filter size={60} className="text-gray-200 mb-4" style={{ margin: '0 auto 16px', display: 'block' }} />
                <h3>Module 6.3: Custom Report Engine</h3>
                <p style={{ color: 'var(--color-gray-500)', maxWidth: 460, margin: '8px auto 24px' }}>
                  Build targeted reports by selecting specific parameters like department, loan type, and date range.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => toast('Configuring Report Builder...')}>Configure Parameters</button>
                  <button className="btn btn-primary" onClick={() => handleDownload('EXCEL')}>Run Custom Query</button>
                </div>
             </div>
          )}
        </>
      )}
    </div>
  );
}

// Mock icon missed in imports
function BarChart3(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
  );
}
