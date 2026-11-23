import { NextRequest, NextResponse } from 'next/server';
import { CloudBackupPayload } from '@/types/cloud-backup';
import fs from 'fs';
import path from 'path';

// In-memory cache for serverless lambda lifecycle
const memoryBackups: Record<string, CloudBackupPayload> = {};

// Local disk path for local dev persistence
const DATA_DIR = path.join(process.cwd(), '.data');
const LOCAL_BACKUP_FILE = path.join(DATA_DIR, 'cloud_backups.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Read-only filesystem in serverless environments (e.g. Vercel)
  }
}

function readLocalBackups(): Record<string, CloudBackupPayload> {
  try {
    if (fs.existsSync(LOCAL_BACKUP_FILE)) {
      const data = fs.readFileSync(LOCAL_BACKUP_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // Ignore read errors
  }
  return memoryBackups;
}

function writeLocalBackup(email: string, payload: CloudBackupPayload) {
  memoryBackups[email] = payload;
  try {
    ensureDataDir();
    const existing = readLocalBackups();
    existing[email] = payload;
    fs.writeFileSync(LOCAL_BACKUP_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch {
    // Ignore write errors in read-only environments
  }
}

// 1. Upstash Redis / Vercel KV Adapter
async function getFromUpstash(email: string): Promise<CloudBackupPayload | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const key = `athletics_backup:${email.toLowerCase().trim()}`;
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.result) return null;
    return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
  } catch (e) {
    console.error('Upstash GET error:', e);
    return null;
  }
}

async function saveToUpstash(email: string, payload: CloudBackupPayload): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;

  try {
    const key = `athletics_backup:${email.toLowerCase().trim()}`;
    const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (e) {
    console.error('Upstash SET error:', e);
    return false;
  }
}

// 2. Firebase Cloud Firestore REST Adapter
async function getFromFirebase(email: string): Promise<CloudBackupPayload | null> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!projectId) return null;

  try {
    const docId = encodeURIComponent(email.toLowerCase().trim().replace(/[@.]/g, '_'));
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/athletics_backups/${docId}${
      apiKey ? `?key=${apiKey}` : ''
    }`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.fields?.payload?.stringValue) return null;
    return JSON.parse(json.fields.payload.stringValue);
  } catch (e) {
    console.error('Firebase GET error:', e);
    return null;
  }
}

async function saveToFirebase(email: string, payload: CloudBackupPayload): Promise<boolean> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!projectId) return false;

  try {
    const docId = encodeURIComponent(email.toLowerCase().trim().replace(/[@.]/g, '_'));
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/athletics_backups/${docId}${
      apiKey ? `?key=${apiKey}` : ''
    }`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          email: { stringValue: email },
          updatedAt: { stringValue: new Date().toISOString() },
          payload: { stringValue: JSON.stringify(payload) },
        },
      }),
    });
    return res.ok;
  } catch (e) {
    console.error('Firebase SET error:', e);
    return false;
  }
}

/**
 * GET /api/cloud-sync?email=coach@gmail.com
 * Fetches the latest backup payload for the requested Gmail address
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Try Upstash / Vercel KV first
    const upstashData = await getFromUpstash(cleanEmail);
    if (upstashData) {
      return NextResponse.json({
        success: true,
        found: true,
        backup: upstashData,
        provider: 'Upstash Redis / Vercel KV',
        timestamp: upstashData.timestamp,
      });
    }

    // 2. Try Firebase Firestore
    const firebaseData = await getFromFirebase(cleanEmail);
    if (firebaseData) {
      return NextResponse.json({
        success: true,
        found: true,
        backup: firebaseData,
        provider: 'Google Firebase Firestore',
        timestamp: firebaseData.timestamp,
      });
    }

    // 3. Fallback to local server store / memory
    const localBackups = readLocalBackups();
    if (localBackups[cleanEmail]) {
      return NextResponse.json({
        success: true,
        found: true,
        backup: localBackups[cleanEmail],
        provider: 'Local Server Storage',
        timestamp: localBackups[cleanEmail].timestamp,
      });
    }

    // Not found
    return NextResponse.json({
      success: true,
      found: false,
      message: `No cloud backup found yet for ${cleanEmail}. Ready to initialize initial backup.`,
    });
  } catch (error: any) {
    console.error('Error fetching cloud backup:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to retrieve cloud backup.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cloud-sync
 * Stores or updates a full backup payload for the given Gmail address
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, payload } = body;

    if (!email || !email.includes('@') || !payload) {
      return NextResponse.json(
        { success: false, message: 'Valid email address and backup payload are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const backupRecord: CloudBackupPayload = {
      ...payload,
      email: cleanEmail,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    let savedProvider = 'Local Server Storage';

    // 1. Try Upstash / Vercel KV
    const upstashOk = await saveToUpstash(cleanEmail, backupRecord);
    if (upstashOk) {
      savedProvider = 'Upstash Redis / Vercel KV';
    }

    // 2. Try Firebase Firestore
    const firebaseOk = await saveToFirebase(cleanEmail, backupRecord);
    if (firebaseOk) {
      savedProvider = 'Google Firebase Firestore';
    }

    // 3. Always write to local disk/memory fallback
    writeLocalBackup(cleanEmail, backupRecord);

    return NextResponse.json({
      success: true,
      message: `Cloud backup saved successfully for ${cleanEmail}!`,
      provider: savedProvider,
      timestamp: backupRecord.timestamp,
      stats: backupRecord.stats,
    });
  } catch (error: any) {
    console.error('Error saving cloud backup:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to save cloud backup.' },
      { status: 500 }
    );
  }
}
