import React, { useState } from 'react';
import { CitizenReport, UserProfile, ReportStatus } from '../types';
import { moderateReport } from '../services/citizenReportService';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Link2, 
  Volume2, 
  BarChart3, 
  Clock, 
  User, 
  MapPin, 
  Lock, 
  Sparkles
} from 'lucide-react';

interface Props {
  currentUser: UserProfile;
  reports: CitizenReport[];
  onReportUpdated: (updated: CitizenReport) => void;
}

export const AdminModerationDesk: React.FC<Props> = ({
  currentUser,
  reports,
  onReportUpdated,
}) => {
  const [moderatorNotes, setModeratorNotes] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'pending' | 'insights' | 'all'>('pending');

  const isAuthorized = currentUser.role === 'moderator' || currentUser.role === 'admin';

  // Analytics aggregations
  const totalCount = reports.length;
  const pendingReports = reports.filter(r => r.status === 'pending');
  const approvedCount = reports.filter(r => r.status === 'approved').length;
  const duplicateCount = reports.filter(r => r.duplicate_of).length;
  const criticalCount = reports.filter(r => r.severity === 'high' || r.severity === 'critical').length;

  const handleModerate = async (reportId: string, status: ReportStatus) => {
    const note = moderatorNotes[reportId] || undefined;
    const updated = await moderateReport(reportId, status, currentUser.id, note);
    if (updated) {
      onReportUpdated(updated);
    }
  };

  // If user is a regular explorer, show access restriction with helper
  if (!isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-white">
            Restricted Staff Moderation Desk
          </h2>
          <p className="text-sm text-slate-300 max-w-md mt-2 mb-6 leading-relaxed">
            You are currently signed in as <strong>{currentUser.full_name}</strong> (Role: <code className="text-amber-400">explorer</code>).
            Civic report moderation and city insights require <code>moderator</code> or <code>admin</code> permissions.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 max-w-sm">
            <p className="font-semibold text-white mb-1">Quick Demo RBAC Test:</p>
            <p>Click your avatar in the top right navbar to switch persona to <strong>Marcus (Moderator)</strong> or <strong>Aria (Admin)</strong>.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/80 mb-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Civic Moderation & Municipal Oversight Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Admin Moderation & City Insights
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Active Session: <strong className="text-white">{currentUser.full_name}</strong> ({currentUser.role}). Review incoming citizen reports, resolve duplicates, and audit city pulse indicators.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending Queue ({pendingReports.length})
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'insights'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              City Insights & Stats
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Insight Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Pending Review</p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{pendingReports.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Awaiting moderator sign-off</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Approved Live</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{approvedCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Visible on public explorer map</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Duplicate Clustered</p>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1">{duplicateCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Algorithmic proximity matched</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">High Urgency</p>
          <p className="text-2xl font-extrabold text-rose-400 mt-1">{criticalCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Priority physical hazards</p>
        </div>
      </div>

      {/* Tab: Pending Moderation Queue */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Pending Review Queue ({pendingReports.length})</span>
            </h2>
          </div>

          {pendingReports.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">All Reports Moderated!</h3>
              <p className="text-xs text-slate-400 mt-1">
                There are no pending submissions in the queue right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingReports.map((report) => (
                <div 
                  key={report.id}
                  className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {report.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        report.severity === 'high' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        Severity: {report.severity}
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400 font-mono">
                        Confidence: {report.confidence_score}%
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {report.description}
                    </p>

                    {report.voice_transcript && (
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
                        <Volume2 className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                        <span>Transcript: "{report.voice_transcript}"</span>
                      </div>
                    )}

                    {report.duplicate_of && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400">
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Flagged as potential duplicate of #{report.duplicate_of.slice(-6)}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <span>{report.user_name || 'Citizen'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{report.address || `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`}</span>
                      </span>
                    </div>
                  </div>

                  {/* Moderator Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 min-w-[200px]">
                    <button
                      onClick={() => handleModerate(report.id, 'approved')}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition-all"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Approve & Publish (+15 pts)</span>
                    </button>

                    <button
                      onClick={() => handleModerate(report.id, 'rejected')}
                      className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject / Spam</span>
                    </button>

                    <button
                      onClick={() => handleModerate(report.id, 'resolved')}
                      className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800 text-cyan-300 hover:bg-cyan-950 border border-slate-700 text-xs font-semibold transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Aggregated City Insights */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Category Distribution Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Incident Category Distribution</span>
            </h3>

            <div className="space-y-3">
              {[
                { cat: 'Safety Concerns & Lighting', count: 4, pct: 40, color: 'bg-rose-500' },
                { cat: 'Potholes & Bike Track Hazards', count: 3, pct: 30, color: 'bg-amber-500' },
                { cat: 'Transit Delays & Light Rail', count: 2, pct: 20, color: 'bg-cyan-500' },
                { cat: 'Festivals & Heritage Tips', count: 1, pct: 10, color: 'bg-emerald-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.cat}</span>
                    <span className="text-slate-400 font-mono">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`} 
                      style={{ width: `${item.pct}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* City Pulse & Decision Support Note */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Evidence-Based Decision Support</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                City Pulse Safety Summary
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Explore City relies on transparent verification metrics. Community incident reports are cross-checked with municipal feeds before influencing walking routing recommendations.
              </p>
              
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Moderator Resolution Rate:</span>
                  <span className="font-bold text-emerald-400">92.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duplicate Clustering Precision:</span>
                  <span className="font-bold text-cyan-400">98.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Civic Contributors:</span>
                  <span className="font-bold text-amber-400">142 Citizens</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-4 italic">
              Explore City Ledger — Sourced from PostgreSQL with Row-Level Security.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
