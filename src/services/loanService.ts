import type { Loan } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let MOCK_LOANS: Loan[] = [
  { id: 'L-1001', memberId: 'CBL-1001', memberName: 'Kasun Perera', loanType: 'Welfare Loan', amount: 500000, date: '2024-01-15', approvedBy: 'SuperAdmin', installmentPlan: 12, amountPaid: 250000, status: 'Being Collected' },
  { id: 'L-1002', memberId: 'mem-0002', memberName: 'Dilani Silva', loanType: 'Disaster Loan', amount: 200000, date: '2024-02-20', approvedBy: 'WelfareAdmin', installmentPlan: 6, amountPaid: 200000, status: 'Completed' },
  { id: 'L-1003', memberId: 'mem-0003', memberName: 'Niroshan Fernando', loanType: 'Welfare Loan', amount: 750000, date: '2024-03-05', approvedBy: 'SuperAdmin', installmentPlan: 18, amountPaid: 125000, status: 'Being Collected' },
  { id: 'L-1004', memberId: 'mem-0004', memberName: 'Sanduni Jayasuriya', loanType: 'Welfare Loan', amount: 300000, date: '2024-03-12', approvedBy: 'WelfareAdmin', installmentPlan: 12, amountPaid: 300000, status: 'Completed' },
  { id: 'L-1005', memberId: 'mem-0005', memberName: 'Pathum Gunawardena', loanType: 'Disaster Loan', amount: 150000, date: '2024-04-01', approvedBy: 'Pending', installmentPlan: 6, amountPaid: 0, status: 'Pending' },
  { id: 'L-1006', memberId: 'mem-0006', memberName: 'Anura Kumara', loanType: 'Welfare Loan', amount: 1000000, date: '2024-04-15', approvedBy: 'SuperAdmin', installmentPlan: 24, amountPaid: 125000, status: 'Being Collected' },
  { id: 'L-1007', memberId: 'CBL-1015', memberName: 'Ramesh Mendis', loanType: 'Disaster Loan', amount: 150000, date: '2024-02-20', approvedBy: 'Admin', installmentPlan: 6, amountPaid: 0, status: 'Rejected' },
  { id: 'L-1008', memberId: 'CBL-1010', memberName: 'Angelo Mathews', loanType: 'Welfare Loan', amount: 750000, date: '2024-03-01', approvedBy: 'Admin', installmentPlan: 18, amountPaid: 0, status: 'Approved' },
];

export const loanService = {
  getAll: async (): Promise<Loan[]> => {
    await delay(600);
    return [...MOCK_LOANS];
  },

  getByMemberId: async (memberId: string): Promise<Loan[]> => {
    await delay(500);
    return MOCK_LOANS.filter(l => l.memberId === memberId);
  },

  create: async (loan: Omit<Loan, 'id'>): Promise<Loan> => {
    await delay(800);
    const newLoan: Loan = { ...loan, id: `L-${Math.floor(1000 + Math.random() * 9000)}` };
    MOCK_LOANS = [newLoan, ...MOCK_LOANS];
    return newLoan;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    MOCK_LOANS = MOCK_LOANS.filter(l => l.id !== id);
  },

  getTotalOutstanding: async (): Promise<number> => {
    return MOCK_LOANS
      .filter(l => l.status === 'Being Collected')
      .reduce((sum, l) => sum + (l.amount - l.amountPaid), 0);
  },
};
