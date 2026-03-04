import type { Contribution, ContributionUploadRow } from '../types';

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

const generateContributions = (): Contribution[] => {
  const contributions: Contribution[] = [];
  const members = [
    { id: 'mem-0001', name: 'Kasun Perera', empId: 'CBL-1001' },
    { id: 'mem-0002', name: 'Dilani Silva', empId: 'CBL-1002' },
    { id: 'mem-0003', name: 'Niroshan Fernando', empId: 'CBL-1003' },
    { id: 'mem-0004', name: 'Sanduni Jayasuriya', empId: 'CBL-1004' },
    { id: 'mem-0005', name: 'Pathum Gunawardena', empId: 'CBL-1005' },
  ];

  let cid = 1;
  for (let year = 2023; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === 2025 && month > 3) break;
      for (const m of members) {
        contributions.push({
          id: `con-${String(cid++).padStart(5, '0')}`,
          memberId: m.id,
          memberName: m.name,
          employeeId: m.empId,
          amount: 5000,
          month,
          year,
          date: `${year}-${String(month).padStart(2, '0')}-05`,
          status: 'Paid',
        });
      }
    }
  }
  return contributions;
};

let mockContributions: Contribution[] = generateContributions();

export const contributionService = {
  getAll: async (): Promise<Contribution[]> => {
    await delay(400);
    return [...mockContributions];
  },

  getByMonth: async (month: number, year: number): Promise<Contribution[]> => {
    await delay(300);
    return mockContributions.filter(c => c.month === month && c.year === year);
  },

  getByMember: async (memberId: string): Promise<Contribution[]> => {
    await delay(300);
    return mockContributions.filter(c => c.memberId === memberId);
  },

  getMonthlyTotal: async (month: number, year: number): Promise<number> => {
    await delay(200);
    return mockContributions
      .filter(c => c.month === month && c.year === year && c.status === 'Paid')
      .reduce((sum, c) => sum + c.amount, 0);
  },

  uploadBatch: async (rows: ContributionUploadRow[]): Promise<{ success: number; errors: number }> => {
    await delay(800);
    let success = 0;
    let errors = 0;
    for (const row of rows) {
      if (!row.hasError) {
        mockContributions.push({
          id: `con-${Date.now()}-${Math.random()}`,
          memberId: '',
          memberName: row.memberName,
          employeeId: row.employeeId,
          amount: row.amount,
          month: row.month,
          year: row.year,
          date: `${row.year}-${String(row.month).padStart(2, '0')}-05`,
          status: 'Paid',
        });
        success++;
      } else {
        errors++;
      }
    }
    return { success, errors };
  },

  getChartData: async (year: number): Promise<Array<{ month: string; contributions: number; loans: number }>> => {
    await delay(300);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((name, i) => ({
      month: name,
      contributions: mockContributions
        .filter(c => c.year === year && c.month === i + 1)
        .reduce((s, c) => s + c.amount, 0),
      loans: Math.floor(Math.random() * 500000 + 100000),
    }));
  },
};
