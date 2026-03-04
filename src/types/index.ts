// ─────────────────────────────────────────────────
// Member Types
// ─────────────────────────────────────────────────
export interface Member {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  gender: 'Male' | 'Female';
  dateJoined: string;
  contributionStatus: 'Active' | 'Inactive';
  email?: string;
  phone?: string;
  position?: string;
  profileImage?: string;
}

// ─────────────────────────────────────────────────
// Loan Types
// ─────────────────────────────────────────────────
export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  loanType: 'Welfare Loan' | 'Disaster Loan';
  amount: number;
  date: string;
  approvedBy: string;
  installmentPlan: number;
  amountPaid: number;
  status: 'Pending' | 'Approved' | 'Being Collected' | 'Completed' | 'Rejected';
}

// ─────────────────────────────────────────────────
// Death Donation Types
// ─────────────────────────────────────────────────
export interface DeathDonation {
  id: string;
  memberId: string;
  memberName: string;
  deceased: string;
  relationship: string;
  amount: number;
  date: string;
  approvedBy: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// ─────────────────────────────────────────────────
// Contribution Types
// ─────────────────────────────────────────────────
export interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  employeeId: string;
  amount: number;
  month: number;
  year: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Arrears';
}

export interface ContributionUploadRow {
  employeeId: string;
  memberName: string;
  amount: number;
  month: number;
  year: number;
  hasError?: boolean;
  errorMessage?: string;
}

// ─────────────────────────────────────────────────
// Report Types
// ─────────────────────────────────────────────────
export interface MonthlyReport {
  month: number;
  year: number;
  totalContributions: number;
  totalMembers: number;
  contributingMembers: number;
  nonContributingMembers: number;
  totalLoans: number;
  totalDonations: number;
}

export interface YearlyReport {
  year: number;
  totalContributions: number;
  totalLoans: number;
  totalDonations: number;
  memberGrowth: number;
  months: MonthlyReport[];
}

export interface LoanReport {
  id: string;
  memberId: string;
  memberName: string;
  loanType: 'Welfare Loan' | 'Disaster Loan';
  amount: number;
  amountPaid: number;
  outstanding: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Being Collected' | 'Completed' | 'Rejected';
}

export interface MemberContributionReport {
  memberId: string;
  employeeId: string;
  memberName: string;
  department: string;
  totalContributed: number;
  monthsPaid: number;
  lastPaymentDate: string;
  status: 'Active' | 'Inactive';
}

// ─────────────────────────────────────────────────
// Meeting Types
// ─────────────────────────────────────────────────
export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  uploadedBy: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
}

// ─────────────────────────────────────────────────
// User & Role Types
// ─────────────────────────────────────────────────
export type UserRole = 'SuperAdmin' | 'WelfareAdmin' | 'Viewer';

export interface Permission {
  module: string;
  superAdmin: boolean;
  welfareAdmin: boolean;
  viewer: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────
// Audit Log Types
// ─────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  action: string;
  user: string;
  date: string;
  record: string;
  module: string;
  ipAddress?: string;
}

// ─────────────────────────────────────────────────
// Dashboard Types
// ─────────────────────────────────────────────────
export interface DashboardStats {
  totalMembers: number;
  totalMaleMembers: number;
  totalFemaleMembers: number;
  totalContributionMonth: number;
  totalOutstandingLoans: number;
  totalDeathDonations: number;
  totalDisasterLoans: number;
  totalAmountPaid: number;
}

export interface DashboardFilter {
  month: number;
  year: number;
  state: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ContributionChartData {
  month: string;
  contributions: number;
  loans: number;
}

export interface YearlyBarData {
  month: string;
  paid: number;
  outstanding: number;
}

// ─────────────────────────────────────────────────
// Backup Types
// ─────────────────────────────────────────────────
export interface BackupInfo {
  lastBackupDate: string;
  lastBackupSize: string;
  status: 'Success' | 'Failed' | 'In Progress' | 'Never';
}

// ─────────────────────────────────────────────────
// Welfare Types
// ─────────────────────────────────────────────────
export interface WelfareBenefit {
  id: string;
  name: string;
  description: string;
  eligibilityCriteria: string;
  maxAmount: number;
  type: 'Loan' | 'Donation' | 'Grant';
  active: boolean;
}
