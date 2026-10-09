import { CitizenReport, ReportCategory, ReportSeverity, ReportStatus } from '../types';
import { localDb } from './storageService';
import { getDistanceKm } from './routesService';
import { analyzeCitizenReportAI } from './geminiService';

export interface CreateReportInput {
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  lat: number;
  lng: number;
  address?: string;
  image_url?: string;
  voice_transcript?: string;
  user_id?: string;
  user_name?: string;
}

// Find duplicates: returns existing reports within 200m of the same category
export function findPotentialDuplicates(
  lat: number,
  lng: number,
  category: ReportCategory,
  allReports: CitizenReport[]
): CitizenReport[] {
  return allReports.filter(rep => {
    if (rep.category !== category) return false;
    const distanceKm = getDistanceKm(lat, lng, rep.lat, rep.lng);
    return distanceKm <= 0.2; // 200 meters
  });
}

export async function getCitizenReports(): Promise<CitizenReport[]> {
  // Local browser-only persistence (versioned localStorage)
  return localDb.getReports();
}

export async function submitCitizenReport(input: CreateReportInput): Promise<{
  report: CitizenReport;
  duplicatesFound: CitizenReport[];
}> {
  const existingReports = await getCitizenReports();
  const duplicates = findPotentialDuplicates(input.lat, input.lng, input.category, existingReports);

  // Run AI analysis via backend Gemini proxy
  const aiAnalysis = await analyzeCitizenReportAI(input);

  const newReport: CitizenReport = {
    id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    user_id: input.user_id || 'user-explorer-001',
    user_name: input.user_name || 'Active Citizen',
    title: input.title,
    description: input.description,
    category: input.category,
    severity: input.severity || (aiAnalysis.suggestedSeverity as ReportSeverity),
    status: 'pending',
    lat: input.lat,
    lng: input.lng,
    address: input.address || `${input.lat.toFixed(4)}, ${input.lng.toFixed(4)}`,
    image_url: input.image_url,
    voice_transcript: input.voice_transcript,
    confidence_score: 55 + (aiAnalysis.confidenceBoost || 10),
    upvotes: 1,
    user_has_voted: true,
    duplicate_of: duplicates.length > 0 ? duplicates[0].id : null,
    data_source: 'citizen_community',
    created_at: new Date().toISOString(),
  };

  // Persist strictly to browser localStorage
  const updated = [newReport, ...existingReports];
  localDb.saveReports(updated);

  return { report: newReport, duplicatesFound: duplicates };
}

export async function voteOnReport(
  reportId: string, 
  voteType: 'up' | 'verify' = 'up'
): Promise<CitizenReport | null> {
  const reports = await getCitizenReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index === -1) return null;

  const rep = reports[index];
  const delta = rep.user_has_voted ? -1 : 1;
  const newUpvotes = Math.max(0, rep.upvotes + delta);
  const boost = voteType === 'verify' ? 8 : 4;
  const newConfidence = Math.min(99, Math.max(20, rep.confidence_score + (delta * boost)));

  const updatedReport: CitizenReport = {
    ...rep,
    upvotes: newUpvotes,
    confidence_score: newConfidence,
    user_has_voted: !rep.user_has_voted,
  };

  reports[index] = updatedReport;
  localDb.saveReports(reports);

  return updatedReport;
}

export async function moderateReport(
  reportId: string,
  newStatus: ReportStatus,
  moderatorId: string,
  moderationNote?: string
): Promise<CitizenReport | null> {
  const reports = await getCitizenReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index === -1) return null;

  const updated: CitizenReport = {
    ...reports[index],
    status: newStatus,
    moderated_by: moderatorId,
    moderated_at: new Date().toISOString(),
    moderation_note: moderationNote || `Marked as ${newStatus} by moderator.`,
  };

  reports[index] = updated;
  localDb.saveReports(reports);

  return updated;
}
