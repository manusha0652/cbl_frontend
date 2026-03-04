import type { DeathDonation } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let MOCK_DONATIONS: DeathDonation[] = [
  { id: 'D-1001', memberId: 'CBL-1001', memberName: 'Kasun Perera', deceased: 'Lilly Perera', relationship: 'Spouse', amount: 200000, date: '2024-01-20', approvedBy: 'SuperAdmin', status: 'Approved' },
  { id: 'D-1002', memberId: 'mem-0004', memberName: 'Sanduni Jayasuriya', deceased: 'Somasiri Jayasuriya', relationship: 'Parent', amount: 150000, date: '2024-02-15', approvedBy: 'WelfareAdmin', status: 'Approved' },
  { id: 'D-1003', memberId: 'mem-0007', memberName: 'Kavinda Rajapaksha', deceased: 'Nimali Rajapaksha', relationship: 'Child', amount: 100000, date: '2024-03-05', approvedBy: 'Pending', status: 'Pending' },
  { id: 'D-1004', memberId: 'mem-0010', memberName: 'Chamari Atapattu', deceased: 'Upul Atapattu', relationship: 'Parent', amount: 150000, date: '2024-03-10', approvedBy: 'Rejected', status: 'Rejected' },
];

export const donationService = {
  getAll: async (): Promise<DeathDonation[]> => {
    await delay(600);
    return [...MOCK_DONATIONS];
  },

  getByMemberId: async (memberId: string): Promise<DeathDonation[]> => {
    await delay(500);
    return MOCK_DONATIONS.filter(d => d.memberId === memberId);
  },

  create: async (donation: Omit<DeathDonation, 'id'>): Promise<DeathDonation> => {
    await delay(800);
    const newDonation: DeathDonation = { ...donation, id: `D-${Math.floor(1000 + Math.random() * 9000)}` };
    MOCK_DONATIONS = [newDonation, ...MOCK_DONATIONS];
    return newDonation;
  },

  update: async (id: string, updates: Partial<DeathDonation>): Promise<DeathDonation> => {
    await delay(400);
    MOCK_DONATIONS = MOCK_DONATIONS.map(d => d.id === id ? { ...d, ...updates } : d);
    const updated = MOCK_DONATIONS.find(d => d.id === id);
    if (!updated) throw new Error('Donation not found');
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    MOCK_DONATIONS = MOCK_DONATIONS.filter(d => d.id !== id);
  },
};
