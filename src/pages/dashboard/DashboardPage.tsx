import { useState, useEffect, useCallback } from 'react';
import {
  Users, User2, UserCheck, DollarSign, CreditCard,
  Heart, AlertTriangle, TrendingUp, FileText, ChevronDown, UserSearch, BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { useAppContext } from '../../context/AppContext';
import { memberService } from '../../services/memberService';
import { loanService } from '../../services/loanService';
import { contributionService } from '../../services/contributionService';
import { meetingService } from '../../services/meetingService';
import type { DashboardStats, Meeting } from '../../types';
import './Dashboard.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEARS  = [2022, 2023, 2024, 2025];
const STATES  = ['All','Western','Central','Southern','Northern','Eastern','North Western','North Central','Uva','Sabaragamuwa'];

const PIE_COLORS = ['#1a3f9f', '#00bdb4', '#22c55e', '#eab308', '#ef4444', '#7c3aed'];

export default function DashboardPage() {
  const { dashboardFilter, setDashboardFilter, setDashboardStats } = useAppContext();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0, totalMaleMembers: 0, totalFemaleMembers: 0,
    totalContributionMonth: 0, totalOutstandingLoans: 0,
    totalDeathDonations: 0, totalDisasterLoans: 0, totalAmountPaid: 0,
  });
  const [chartData, setChartData] = useState<Array<{ month: string; contributions: number; loans: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [latestMeeting, setLatestMeeting] = useState<Meeting | undefined>();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('All Employees');
  const [showEmpFilter, setShowEmpFilter] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [counts, outstanding, contribution, chart, meeting] = await Promise.all([
        memberService.count(),
        loanService.getTotalOutstanding(),
        contributionService.getMonthlyTotal(dashboardFilter.month, dashboardFilter.year),
        contributionService.getChartData(dashboardFilter.year),
        meetingService.getLatest(),
      ]);

      const newStats: DashboardStats = {
        totalMembers: counts.total,
        totalMaleMembers: counts.male,
        totalFemaleMembers: counts.female,
        totalContributionMonth: contribution,
        totalOutstandingLoans: outstanding,
        totalDeathDonations: 3 + dashboardFilter.month * 2,
        totalDisasterLoans: 2 + dashboardFilter.month,
        totalAmountPaid: counts.total * 5000 * (dashboardFilter.month - 1),
      };

      setStats(newStats);
      setDashboardStats(newStats);
      setChartData(chart);
      setLatestMeeting(meeting);
    } finally {
      setLoading(false);
    }
  }, [dashboardFilter.month, dashboardFilter.year, setDashboardStats]);

  useEffect(() => { void loadData(); }, [loadData]);

  const loanPieData = [
    { name: 'Welfare Loans', value: 8 },
    { name: 'Disaster Loans', value: 4 },
    { name: 'Completed', value: 3 },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header flex justify-between items-end">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Section 6: Analytics & Reporting Summary</p>
        </div>
        
        {/* Whiteboard Section 6: Analytics Type Filter */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="analytics-toggle">
            <button className="toggle-btn active"><BarChart3 size={14} /> Analytics</button>
            <button className="toggle-btn" onClick={() => setShowEmpFilter(!showEmpFilter)}>
               <UserSearch size={14} /> {selectedEmployee === 'All Employees' ? 'By Employee' : selectedEmployee} <ChevronDown size={14} />
            </button>
            
            {showEmpFilter && (
              <div className="emp-dropdown card">
                 <div className="p-2">
                   <input type="text" className="form-control form-control-sm" placeholder="Search employee..." autoFocus />
                 </div>
                 <div className="emp-list">
                    {['All Employees', 'Kasun Perera', 'Dilani Silva', 'Niroshan Fernando', 'Sanduni Jayasuriya'].map(name => (
                      <div 
                        key={name} 
                        className={`emp-item ${selectedEmployee === name ? 'active' : ''}`}
                        onClick={() => { setSelectedEmployee(name); setShowEmpFilter(false); }}
                      >
                        {name}
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters card">
        <div className="filter-group">
          <label className="form-label">Month</label>
          <select
            className="form-control"
            value={dashboardFilter.month}
            onChange={e => setDashboardFilter({ ...dashboardFilter, month: Number(e.target.value) })}
          >
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">Year</label>
          <select
            className="form-control"
            value={dashboardFilter.year}
            onChange={e => setDashboardFilter({ ...dashboardFilter, year: Number(e.target.value) })}
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">Province</label>
          <select
            className="form-control"
            value={dashboardFilter.state}
            onChange={e => setDashboardFilter({ ...dashboardFilter, state: e.target.value })}
          >
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-meta">
          <span>{selectedEmployee} &bull; <strong>{MONTHS[dashboardFilter.month - 1]} {dashboardFilter.year}</strong></span>
          {dashboardFilter.state !== 'All' && <span> &bull; {dashboardFilter.state}</span>}
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="stats-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="stat-skeleton card">
              <div className="skeleton skeleton-circle" />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-text sm" style={{ marginBottom: 8 }} />
                <div className="skeleton skeleton-text lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stats-grid">
          <StatCard title="Total Members" value={stats.totalMembers} icon={<Users size={22} />} color="primary" subtitle="Registered welfare members" />
          <StatCard title="Male Members" value={stats.totalMaleMembers} icon={<User2 size={22} />} color="info" subtitle="Active male employees" />
          <StatCard title="Female Members" value={stats.totalFemaleMembers} icon={<UserCheck size={22} />} color="teal" subtitle="Active female employees" />
          <StatCard title="Monthly Contributions" value={stats.totalContributionMonth} icon={<DollarSign size={22} />} color="success" subtitle={`${MONTHS[dashboardFilter.month - 1]} ${dashboardFilter.year}`} formatAsCurrency />
          <StatCard title="Outstanding Loans" value={stats.totalOutstandingLoans} icon={<CreditCard size={22} />} color="warning" subtitle="Total unpaid balance" formatAsCurrency />
          <StatCard title="Death Donations" value={stats.totalDeathDonations} icon={<Heart size={22} />} color="danger" subtitle={`Processed in ${dashboardFilter.year}`} />
          <StatCard title="Disaster Loans" value={stats.totalDisasterLoans} icon={<AlertTriangle size={22} />} color="purple" subtitle={`Disaster relief ${dashboardFilter.year}`} />
          <StatCard title="Total Amount Paid" value={stats.totalAmountPaid} icon={<TrendingUp size={22} />} color="teal" subtitle="Cumulative contributions" formatAsCurrency />
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Monthly Contributions vs Loans — {dashboardFilter.year}</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `Rs.${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => `Rs.${v.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="contributions" stroke="#1a3f9f" strokeWidth={2.5} dot={{ r: 4 }} name="Contributions" />
                <Line type="monotone" dataKey="loans" stroke="#00bdb4" strokeWidth={2.5} dot={{ r: 4 }} name="Loans" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Loan Distribution</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={loanPieData} cx="50%" cy="45%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {loanPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>Yearly Payment Overview — {dashboardFilter.year}</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `Rs.${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => `Rs.${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="contributions" fill="#1a3f9f" name="Contributions" radius={[4,4,0,0]} />
              <Bar dataKey="loans" fill="#00bdb4" name="Loans" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Meeting Minutes */}
      {latestMeeting && (
        <div className="card">
          <div className="card-header">
            <h3><FileText size={16} style={{ marginRight: 8, display: 'inline' }} />Latest Meeting Minutes</h3>
          </div>
          <div className="card-body">
            <div className="meeting-card-preview">
              <div className="meeting-icon"><FileText size={24} /></div>
              <div>
                <p className="meeting-title">{latestMeeting.title}</p>
                <p className="meeting-meta">{latestMeeting.date} &bull; Uploaded by {latestMeeting.uploadedBy} &bull; {latestMeeting.fileSize}</p>
                <p className="meeting-desc">{latestMeeting.description}</p>
              </div>
              <button className="btn btn-outline btn-sm">Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
