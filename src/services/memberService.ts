import type { Member } from '../types';

// ─── Mock Data ───────────────────────────────────
const DEPARTMENTS = [
  'Finance', 'IT', 'HR', 'Operations', 'Marketing',
  'Legal', 'Procurement', 'Audit', 'Administration', 'Engineering',
];

const generateMembers = (): Member[] => {
  const names = [
    'Kasun Perera', 'Dilani Silva', 'Niroshan Fernando', 'Sanduni Jayasuriya', 'Pathum Gunawardena',
    'Anura Kumara', 'Kavinda Rajapaksha', 'Lakshani Siriwardena', 'Ramesh Mendis', 'Chamari Atapattu',
    'Angelo Mathews', 'Lasith Malinga', 'Mahela Jayawardene', 'Kumar Sangakkara', 'Muttiah Muralitharan',
    'Sanath Jayasuriya', 'Tilakaratne Dilshan', 'Rangana Herath', 'Nuwan Kulasekara', 'Upul Tharanga',
    'Dhananjaya de Silva', 'Kusal Perera', 'Dimuth Karunaratne', 'Dinesh Chandimal', 'Suranga Lakmal',
    'Lahiru Thirimanne', 'Isuru Udana', 'Wanindu Hasaranga', 'Dushmantha Chameera', 'Charith Asalanka',
    'Maheesh Theekshana', 'Sadeera Samarawickrama', 'Pathum Nissanka', 'Dilshan Madushanka', 'Dunith Wellalage',
    'Janith Liyanage', 'Asitha Fernando', 'Vishwa Fernando', 'Kamindu Mendis', 'Jeffrey Vandersay',
    'Akila Dananjaya', 'Bhanuka Rajapaksa', 'Minod Bhanuka', 'Lahiru Kumara', 'Praveen Jayawickrama',
    'Shiran Fernando', 'Chamika Karunaratne', 'Binura Fernando', 'Oshada Fernando', 'Asela Gunaratne'
  ];

  return names.map((name, i) => ({
    id: `mem-${String(i + 1).padStart(4, '0')}`,
    employeeId: `CBL-${String(1000 + i + 1)}`,
    name,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    gender: ['Dilani Silva', 'Sanduni Jayasuriya', 'Lakshani Siriwardena', 'Chamari Atapattu'].includes(name) ? 'Female' : 'Male',
    dateJoined: new Date(2018 + (i % 6), i % 12, (i % 28) + 1).toISOString().slice(0, 10),
    contributionStatus: i % 7 === 0 ? 'Inactive' : 'Active',
    email: `${name.toLowerCase().replace(/ /g, '.')}@cbl.lk`,
    phone: `077${String(1000000 + i * 13567).slice(0, 7)}`,
    position: ['Manager', 'Officer', 'Senior Officer', 'Assistant', 'Director'][i % 5],
  }));
};

let mockMembers: Member[] = generateMembers();

// ─── Service Functions ────────────────────────────
export const memberService = {
  getAll: async (): Promise<Member[]> => {
    await delay(400);
    return [...mockMembers];
  },

  getById: async (id: string): Promise<Member | undefined> => {
    await delay(300);
    return mockMembers.find(m => m.id === id);
  },

  create: async (member: Omit<Member, 'id'>): Promise<Member> => {
    await delay(500);
    const newMember: Member = { ...member, id: `mem-${Date.now()}` };
    mockMembers = [newMember, ...mockMembers];
    return newMember;
  },

  update: async (id: string, updates: Partial<Member>): Promise<Member> => {
    await delay(400);
    mockMembers = mockMembers.map(m => m.id === id ? { ...m, ...updates } : m);
    const updated = mockMembers.find(m => m.id === id);
    if (!updated) throw new Error('Member not found');
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    mockMembers = mockMembers.filter(m => m.id !== id);
  },

  count: async (): Promise<{ total: number; male: number; female: number }> => {
    await delay(200);
    const male = mockMembers.filter(m => m.gender === 'Male').length;
    const female = mockMembers.filter(m => m.gender === 'Female').length;
    return { total: mockMembers.length, male, female };
  },
};

// ─── Utility ─────────────────────────────────────
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
