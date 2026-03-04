import type { WelfareBenefit } from '../types';

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

let mockBenefits: WelfareBenefit[] = [
  {
    id: 'wfb-001',
    name: 'Welfare Loan',
    description: 'Financial assistance loan provided to eligible members facing personal financial challenges.',
    eligibilityCriteria: 'Active member with minimum 6 months contribution. Maximum 2 active loans at a time.',
    maxAmount: 1000000,
    type: 'Loan',
    active: true,
  },
  {
    id: 'wfb-002',
    name: 'Disaster Loan',
    description: 'Emergency financial support for members affected by natural disasters, fire, or other calamities.',
    eligibilityCriteria: 'Active member. Must provide evidence of disaster (fire incident report, flood certificate, etc.).',
    maxAmount: 500000,
    type: 'Loan',
    active: true,
  },
  {
    id: 'wfb-003',
    name: 'Death Donation',
    description: 'Compassionate donation provided to the family of a deceased member or for immediate family member bereavement.',
    eligibilityCriteria: 'Active member. Covers member\'s spouse, children, and parents. Maximum 2 claims per year.',
    maxAmount: 100000,
    type: 'Donation',
    active: true,
  },
  {
    id: 'wfb-004',
    name: 'Medical Grant',
    description: 'Partial reimbursement for major medical expenses not covered by NHIS.',
    eligibilityCriteria: 'Active member. Must present hospital bills and medical reports. Maximum 1 claim per year.',
    maxAmount: 200000,
    type: 'Grant',
    active: false,
  },
];

export const welfareService = {
  getBenefits: async (): Promise<WelfareBenefit[]> => {
    await delay(300);
    return [...mockBenefits];
  },

  updateBenefit: async (id: string, updates: Partial<WelfareBenefit>): Promise<WelfareBenefit> => {
    await delay(400);
    mockBenefits = mockBenefits.map(b => b.id === id ? { ...b, ...updates } : b);
    const updated = mockBenefits.find(b => b.id === id);
    if (!updated) throw new Error('Benefit not found');
    return updated;
  },
};
