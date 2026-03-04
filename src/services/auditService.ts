import type { AuditLog } from '../types';

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

const mockLogs: AuditLog[] = [
  { id: 'log-001', action: 'Member Created', user: 'Kasun Perera (SuperAdmin)', date: '2025-03-04T08:12:00', record: 'Pathum Nissanka (CBL-1001)', module: 'Members', ipAddress: '192.168.1.10' },
  { id: 'log-002', action: 'Loan Approved', user: 'Dilani Silva (WelfareAdmin)', date: '2025-03-04T09:45:00', record: 'Loan #loan-003 – Rs.750,000', module: 'Loans', ipAddress: '192.168.1.15' },
  { id: 'log-003', action: 'Contribution Upload', user: 'Kasun Perera (SuperAdmin)', date: '2025-03-03T14:20:00', record: '45 records uploaded for Feb 2025', module: 'Contributions', ipAddress: '192.168.1.10' },
  { id: 'log-004', action: 'Member Deleted', user: 'Anura Kumara (WelfareAdmin)', date: '2025-03-03T11:00:00', record: 'Temp Employee #CBL-9999', module: 'Members', ipAddress: '192.168.1.22' },
  { id: 'log-005', action: 'Report Exported', user: 'Kasun Perera (SuperAdmin)', date: '2025-03-02T16:30:00', record: 'Monthly Report – February 2025 (PDF)', module: 'Reports', ipAddress: '192.168.1.10' },
  { id: 'log-006', action: 'Meeting Minutes Uploaded', user: 'Dilani Silva (WelfareAdmin)', date: '2025-03-02T10:15:00', record: 'Q1 2025 Welfare Meeting Minutes', module: 'Meetings', ipAddress: '192.168.1.15' },
  { id: 'log-007', action: 'User Role Updated', user: 'Kasun Perera (SuperAdmin)', date: '2025-03-01T09:00:00', record: 'Chamari Atapattu – Role changed to WelfareAdmin', module: 'Users', ipAddress: '192.168.1.10' },
  { id: 'log-008', action: 'System Backup', user: 'System Auto', date: '2025-03-01T00:00:00', record: 'Backup completed – 24.5 MB', module: 'System', ipAddress: '127.0.0.1' },
  { id: 'log-009', action: 'Death Donation Added', user: 'Dilani Silva (WelfareAdmin)', date: '2025-02-28T13:45:00', record: 'Donation for Lasith Malinga – Rs.50,000', module: 'Welfare', ipAddress: '192.168.1.15' },
  { id: 'log-010', action: 'Loan Status Updated', user: 'Anura Kumara (WelfareAdmin)', date: '2025-02-27T11:30:00', record: 'Loan #loan-002 marked Completed', module: 'Loans', ipAddress: '192.168.1.22' },
  { id: 'log-011', action: 'Member Updated', user: 'Dilani Silva (WelfareAdmin)', date: '2025-02-26T09:15:00', record: 'Sanduni Jayasuriya – Department changed', module: 'Members', ipAddress: '192.168.1.15' },
  { id: 'log-012', action: 'Report Exported', user: 'Kasun Perera (SuperAdmin)', date: '2025-02-25T15:00:00', record: 'Yearly Report – 2024 (Excel)', module: 'Reports', ipAddress: '192.168.1.10' },
];

export const auditService = {
  getAll: async (): Promise<AuditLog[]> => {
    await delay(400);
    return [...mockLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  search: async (query: string, dateFrom?: string, dateTo?: string): Promise<AuditLog[]> => {
    await delay(300);
    let filtered = [...mockLogs];
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q) ||
        l.record.toLowerCase().includes(q) ||
        l.module.toLowerCase().includes(q),
      );
    }
    if (dateFrom) filtered = filtered.filter(l => l.date >= dateFrom);
    if (dateTo) filtered = filtered.filter(l => l.date <= dateTo + 'T23:59:59');
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  log: async (action: string, user: string, record: string, module: string): Promise<void> => {
    await delay(100);
    mockLogs.unshift({
      id: `log-${Date.now()}`,
      action,
      user,
      date: new Date().toISOString(),
      record,
      module,
      ipAddress: '192.168.1.10',
    });
  },
};
