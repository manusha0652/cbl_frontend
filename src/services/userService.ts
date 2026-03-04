import type { AppUser, Permission, BackupInfo } from '../types';

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

let mockUsers: AppUser[] = [
  {
    id: 'usr-001', name: 'Kasun Perera', email: 'kasun.perera@cbl.lk',
    role: 'SuperAdmin', department: 'Administration', status: 'Active',
    lastLogin: '2025-03-04T08:10:00', createdAt: '2018-01-10',
  },
  {
    id: 'usr-002', name: 'Dilani Silva', email: 'dilani.silva@cbl.lk',
    role: 'WelfareAdmin', department: 'HR', status: 'Active',
    lastLogin: '2025-03-04T09:30:00', createdAt: '2019-03-15',
  },
  {
    id: 'usr-003', name: 'Niroshan Fernando', email: 'niroshan.fernando@cbl.lk',
    role: 'WelfareAdmin', department: 'Finance', status: 'Active',
    lastLogin: '2025-03-03T11:00:00', createdAt: '2020-06-01',
  },
  {
    id: 'usr-004', name: 'Sanduni Jayasuriya', email: 'sanduni.jayasuriya@cbl.lk',
    role: 'Viewer', department: 'Audit', status: 'Active',
    lastLogin: '2025-03-02T14:00:00', createdAt: '2022-09-20',
  },
  {
    id: 'usr-005', name: 'Anura Kumara', email: 'anura.kumara@cbl.lk',
    role: 'Viewer', department: 'Legal', status: 'Inactive',
    lastLogin: '2025-01-15T10:00:00', createdAt: '2021-02-11',
  },
];

const mockPermissions: Permission[] = [
  { module: 'Dashboard', superAdmin: true, welfareAdmin: true, viewer: true },
  { module: 'Members', superAdmin: true, welfareAdmin: true, viewer: false },
  { module: 'Contributions', superAdmin: true, welfareAdmin: true, viewer: false },
  { module: 'Loans', superAdmin: true, welfareAdmin: true, viewer: false },
  { module: 'Reports', superAdmin: true, welfareAdmin: true, viewer: true },
  { module: 'Welfare', superAdmin: true, welfareAdmin: true, viewer: false },
  { module: 'Meeting Minutes', superAdmin: true, welfareAdmin: true, viewer: true },
  { module: 'Users & Roles', superAdmin: true, welfareAdmin: false, viewer: false },
  { module: 'Audit Logs', superAdmin: true, welfareAdmin: false, viewer: false },
  { module: 'Settings', superAdmin: true, welfareAdmin: false, viewer: false },
];

let backupInfo: BackupInfo = {
  lastBackupDate: '2025-03-01T00:00:00',
  lastBackupSize: '24.5 MB',
  status: 'Success',
};

export const userService = {
  getAll: async (): Promise<AppUser[]> => {
    await delay(400);
    return [...mockUsers];
  },

  create: async (user: Omit<AppUser, 'id'>): Promise<AppUser> => {
    await delay(500);
    const newUser: AppUser = { ...user, id: `usr-${Date.now()}` };
    mockUsers = [...mockUsers, newUser];
    return newUser;
  },

  update: async (id: string, updates: Partial<AppUser>): Promise<AppUser> => {
    await delay(400);
    mockUsers = mockUsers.map(u => u.id === id ? { ...u, ...updates } : u);
    const updated = mockUsers.find(u => u.id === id);
    if (!updated) throw new Error('User not found');
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    mockUsers = mockUsers.filter(u => u.id !== id);
  },

  getPermissions: async (): Promise<Permission[]> => {
    await delay(300);
    return [...mockPermissions];
  },

  updatePermission: async (module: string, role: keyof Omit<Permission, 'module'>, value: boolean): Promise<void> => {
    await delay(300);
    const perm = mockPermissions.find(p => p.module === module);
    if (perm) perm[role] = value;
  },

  getBackupInfo: async (): Promise<BackupInfo> => {
    await delay(200);
    return { ...backupInfo };
  },

  runBackup: async (): Promise<BackupInfo> => {
    await delay(2000);
    backupInfo = {
      lastBackupDate: new Date().toISOString(),
      lastBackupSize: `${(Math.random() * 10 + 20).toFixed(1)} MB`,
      status: 'Success',
    };
    return { ...backupInfo };
  },
};
