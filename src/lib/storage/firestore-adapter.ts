/**
 * Phase 9: Database and Security Specification
 * Formal Cloud Firestore Schema and Security Architecture
 */

export const FIRESTORE_COLLECTIONS = {
  ORGANIZATIONS: 'organizations',
  USERS: 'users',
  ATHLETES: 'athletes',
  ASSESSMENTS: 'assessments',
  COMPETITIONS: 'competitions',
  PERFORMANCE_RECORDS: 'performanceRecords',
  TEST_DEFINITIONS: 'testDefinitions',
  TEST_BATTERIES: 'testBatteries',
  NORM_SOURCES: 'normSources',
  NORM_DATASETS: 'normDatasets',
  SCORING_CONFIGURATIONS: 'scoringConfigurations',
  REPORT_SNAPSHOTS: 'reportSnapshots',
  AUDIT_LOGS: 'auditLogs',
} as const;

export type FirestoreCollectionName = typeof FIRESTORE_COLLECTIONS[keyof typeof FIRESTORE_COLLECTIONS];

/**
 * Standard Organization Scope Query Filter
 */
export interface OrgScopedQuery {
  organizationId: string;
}

/**
 * Example Firestore Security Rules Definition (Production Reference)
 */
export const FIRESTORE_SECURITY_RULES_MD = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isSignedIn() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isOrgAdmin(orgId) {
      return isSignedIn() && getUserData().role == 'ADMIN' && getUserData().organizationId == orgId;
    }
    
    function isOrgCoach(orgId) {
      return isSignedIn() && (getUserData().role == 'COACH' || getUserData().role == 'ADMIN') && getUserData().organizationId == orgId;
    }
    
    function isAssignedAthlete(athleteId) {
      return isSignedIn() && getUserData().role == 'ATHLETE' && getUserData().athleteId == athleteId;
    }

    // Athletes collection
    match /athletes/{athleteId} {
      allow read: if isSignedIn() && (isOrgCoach(resource.data.organizationId) || isAssignedAthlete(athleteId));
      allow write: if isOrgCoach(request.resource.data.organizationId);
    }

    // Official Assessments: Only authorized coaches can create or update
    match /assessments/{assessmentId} {
      allow read: if isSignedIn() && (isOrgCoach(resource.data.organizationId) || isAssignedAthlete(resource.data.athleteId));
      allow create, update: if isOrgCoach(request.resource.data.organizationId);
      allow delete: if isOrgAdmin(resource.data.organizationId);
    }

    // Competitions and Performances
    match /competitions/{compId} {
      allow read: if isSignedIn();
      allow write: if isOrgCoach(request.resource.data.organizationId);
    }

    match /performanceRecords/{perfId} {
      allow read: if isSignedIn();
      allow write: if isOrgCoach(request.resource.data.organizationId);
    }

    // Audit logs: append-only, admin read
    match /auditLogs/{logId} {
      allow create: if isSignedIn();
      allow read: if isOrgAdmin(resource.data.organizationId);
    }
  }
}
`;
