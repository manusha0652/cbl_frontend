import type {
  MonthlyReport, YearlyReport, LoanReport, MemberContributionReport,
} from '../types';

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const reportService = {
  getMonthlyReport: async (month: number, year: number): Promise<MonthlyReport> => {
    await delay(400);
    return {
      month, year,
      totalContributions: 250000 + Math.floor(Math.random() * 50000),
      totalMembers: 50,
      contributingMembers: 43 + Math.floor(Math.random() * 5),
      nonContributingMembers: 7 - Math.floor(Math.random() * 5),
      totalLoans: 3 + Math.floor(Math.random() * 3),
      totalDonations: Math.floor(Math.random() * 2),
    };
  },

  getYearlyReport: async (year: number): Promise<YearlyReport> => {
    await delay(500);
    const months: MonthlyReport[] = MONTHS.map((_, i) => ({
      month: i + 1, year,
      totalContributions: 230000 + Math.floor(Math.random() * 70000),
      totalMembers: 50,
      contributingMembers: 42 + Math.floor(Math.random() * 6),
      nonContributingMembers: 8 - Math.floor(Math.random() * 6),
      totalLoans: 2 + Math.floor(Math.random() * 4),
      totalDonations: Math.floor(Math.random() * 3),
    }));
    return {
      year,
      totalContributions: months.reduce((s, m) => s + m.totalContributions, 0),
      totalLoans: months.reduce((s, m) => s + m.totalLoans, 0),
      totalDonations: months.reduce((s, m) => s + m.totalDonations, 0),
      memberGrowth: 5 + Math.floor(Math.random() * 10),
      months,
    };
  },

  getLoanReport: async (): Promise<LoanReport[]> => {
    await delay(400);
    return [
      { id: 'loan-001', memberId: 'mem-0001', memberName: 'Kasun Perera', loanType: 'Welfare Loan', amount: 500000, amountPaid: 200000, outstanding: 300000, date: '2024-01-15', status: 'Being Collected' },
      { id: 'loan-002', memberId: 'mem-0002', memberName: 'Dilani Silva', loanType: 'Disaster Loan', amount: 200000, amountPaid: 200000, outstanding: 0, date: '2024-02-20', status: 'Completed' },
      { id: 'loan-003', memberId: 'mem-0003', memberName: 'Niroshan Fernando', loanType: 'Welfare Loan', amount: 750000, amountPaid: 125000, outstanding: 625000, date: '2024-03-05', status: 'Being Collected' },
      { id: 'loan-004', memberId: 'mem-0033', memberName: 'Pathum Nissanka', loanType: 'Welfare Loan', amount: 1000000, amountPaid: 125000, outstanding: 875000, date: '2024-04-15', status: 'Being Collected' },
      { id: 'loan-005', memberId: 'mem-0012', memberName: 'Lasith Malinga', loanType: 'Welfare Loan', amount: 850000, amountPaid: 141667, outstanding: 708333, date: '2024-06-08', status: 'Being Collected' },
    ];
  },

  getMemberContributionReport: async (): Promise<MemberContributionReport[]> => {
    await delay(400);
    const depts = ['Finance', 'IT', 'HR', 'Operations', 'Marketing'];
    const names = [
      'Kasun Perera', 'Dilani Silva', 'Niroshan Fernando', 'Sanduni Jayasuriya', 'Pathum Gunawardena',
      'Anura Kumara', 'Kavinda Rajapaksha', 'Lakshani Siriwardena', 'Ramesh Mendis', 'Chamari Atapattu',
      'Angelo Mathews', 'Lasith Malinga', 'Mahela Jayawardene', 'Kumar Sangakkara', 'Muttiah Muralitharan',
      'Sanath Jayasuriya', 'Tilakaratne Dilshan', 'Rangana Herath', 'Nuwan Kulasekara', 'Upul Tharanga'
    ];
    return Array.from({ length: 20 }, (_, i) => ({
      memberId: `mem-${String(i + 1).padStart(4, '0')}`,
      employeeId: `CBL-${1001 + i}`,
      memberName: names[i],
      department: depts[i % depts.length],
      totalContributed: 5000 * (12 - Math.floor(Math.random() * 3)),
      monthsPaid: 12 - Math.floor(Math.random() * 3),
      lastPaymentDate: `2025-0${1 + Math.floor(Math.random() * 2)}-05`,
      status: i % 7 === 0 ? 'Inactive' : 'Active',
    }));
  },
};
