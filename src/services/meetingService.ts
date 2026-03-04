import type { Meeting } from '../types';

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

let mockMeetings: Meeting[] = [
  {
    id: 'mtg-001',
    title: 'Q1 2025 Welfare Committee General Meeting',
    description: 'Review of welfare activities, loan approvals, and member contributions for Q1 2025. Budget allocation discussion for upcoming death donation fund.',
    date: '2025-03-01',
    uploadedBy: 'Musa Usman',
    fileName: 'Q1_2025_Welfare_Meeting_Minutes.pdf',
    fileSize: '1.2 MB',
    fileUrl: '#',
  },
  {
    id: 'mtg-002',
    title: 'Emergency Disaster Relief Fund Meeting',
    description: 'Emergency meeting to approve disaster loan applications following the flood in the Northern region affecting 12 member families.',
    date: '2025-02-14',
    uploadedBy: 'Fatima Ibrahim',
    fileName: 'Emergency_Disaster_Fund_Feb2025.pdf',
    fileSize: '890 KB',
    fileUrl: '#',
  },
  {
    id: 'mtg-003',
    title: 'Annual General Meeting – Welfare Society 2024 Review',
    description: 'Comprehensive annual review of all welfare activities, financial performance, loan statistics, and election of new committee members.',
    date: '2025-01-15',
    uploadedBy: 'Musa Usman',
    fileName: 'AGM_2024_Annual_Review_Minutes.pdf',
    fileSize: '3.4 MB',
    fileUrl: '#',
  },
  {
    id: 'mtg-004',
    title: 'Q4 2024 Welfare Committee Meeting',
    description: 'End of year welfare committee review and planning session. Discussion of 2025 welfare program calendar.',
    date: '2024-12-10',
    uploadedBy: 'Admin Yusuf',
    fileName: 'Q4_2024_Welfare_Meeting_Minutes.pdf',
    fileSize: '1.5 MB',
    fileUrl: '#',
  },
  {
    id: 'mtg-005',
    title: 'Q3 2024 Welfare Committee Meeting',
    description: 'Third quarter welfare performance review. Loan approval statistics and contribution collection rate analysis.',
    date: '2024-09-05',
    uploadedBy: 'Fatima Ibrahim',
    fileName: 'Q3_2024_Welfare_Meeting_Minutes.pdf',
    fileSize: '1.1 MB',
    fileUrl: '#',
  },
];

export const meetingService = {
  getAll: async (): Promise<Meeting[]> => {
    await delay(400);
    return [...mockMeetings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getLatest: async (): Promise<Meeting | undefined> => {
    await delay(200);
    return [...mockMeetings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  },

  create: async (meeting: Omit<Meeting, 'id'>): Promise<Meeting> => {
    await delay(600);
    const newMeeting: Meeting = { ...meeting, id: `mtg-${Date.now()}` };
    mockMeetings = [newMeeting, ...mockMeetings];
    return newMeeting;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    mockMeetings = mockMeetings.filter(m => m.id !== id);
  },
};
