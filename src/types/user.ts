export type UserRole = 'ADMIN' | 'COACH' | 'ATHLETE';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  athleteId?: string; // If role is ATHLETE, linked athlete record ID
  assignedSquads?: string[];
  avatarUrl?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string; // e.g. "National Athletics High Performance Centre"
  shortCode: string; // "NAHPC"
  logoUrl?: string;
  primaryColor: string; // Default: "#EAB308"
  country: string;
  trackSurface: string;
  adminUserIds: string[];
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: UserRole;
  action: 'create' | 'update' | 'delete' | 'finalize' | 'export_report' | 'recalculate';
  entityType: 'athlete' | 'assessment' | 'competition' | 'performanceRecord' | 'normDataset' | 'settings' | 'training_plan';
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}
