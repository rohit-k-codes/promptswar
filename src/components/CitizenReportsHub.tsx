import React, { useState } from 'react';
import { CitizenReport, ReportCategory, ReportSeverity, ReportStatus } from '../types';
import { ProvenanceBadge } from './ProvenanceBadge';
import { 
  ShieldAlert, 
  ThumbsUp, 
  CheckCircle2, 
  Volume2, 
  Plus, 
  Search, 
  MapPin, 
  Link2
} from 'lucide-react';

interface Props {
  reports: CitizenReport[];
  onVote: (reportId: string, type: 'up' | 'verify') => void;
  onOpenCreateModal: () => void;
}

export const CitizenReportsHub: React.FC<Props> = ({
  reports,
  onVote,
  onOpenCreateModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<ReportSeverity | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = reports.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || r.severity === severityFilter;
    const matchesSearch = 
      !searchQuery.trim() ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const getCategoryEmoji = (cat: ReportCategory) => {
    switch (cat) {
      case 'safety_concern': return '⚠️';
      case 'street_light': return '💡';
      case 'pothole': return '🕳️';
      case 'transit_delay': return '🚊';
      case 'crowd_surge': return '👥';
      case 'festival_event': return '🎉';
      case 'heritage_tip': return '🏛️';
      case 'accessibility_barrier': return '♿';
      default: return '📌';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/80 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Decentralized Civic Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Citizen Reports & Safety Verification
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Real-time crowd-sourced infrastructure alerts, festival discoveries, and safety updates. Transparent provenance with algorithmic duplicate detection.
            </p>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-extrabold text-sm shadow-glow-amber hover:opacity-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Report Street Incident</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by title, street, or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Filters */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'all' as const, label: 'All Status' },
              { id: 'approved' as const, label: 'Approved' },
              { id: 'pending' as const, label: 'Pending' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'all' as const, label: 'All Urgency' },
              { id: 'high' as const, label: 'High & Critical' },
              { id: 'low' as const, label: 'Low / Tips' },
            ].map((sev) => (
              <button
                key={sev.id}
                onClick={() => setSeverityFilter(sev.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  severityFilter === sev.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((report) => (
          <div 
            key={report.id}
            className="glass-card rounded-2xl border border-slate-800/90 p-5 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Category, Status & Provenance */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-800/90 text-slate-200 border border-slate-700">
                  <span>{getCategoryEmoji(report.category)}</span>
                  <span className="capitalize">{report.category.replace('_', ' ')}</span>
                </span>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  report.status === 'approved' 
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                }`}>
                  {report.status}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                {report.title}
              </h3>
              
              <div className="mb-3">
                <ProvenanceBadge source={report.data_source} timestamp={report.created_at} showTimestamp={true} />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                {report.description}
              </p>

              {/* Duplicate Indicator */}
              {report.duplicate_of && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 mb-3">
                  <Link2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Clustered Duplicate of Parent #{report.duplicate_of.slice(-6)}</span>
                </div>
              )}

              {/* Voice Transcript Pill */}
              {report.voice_transcript && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-[11px] text-cyan-300 mb-3">
                  <Volume2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">"{report.voice_transcript}"</span>
                </div>
              )}

              {/* Image Preview if present */}
              {report.image_url && (
                <div className="h-32 w-full rounded-xl overflow-hidden mb-3 bg-slate-900 border border-slate-800">
                  <img 
                    src={report.image_url} 
                    alt={report.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              {/* Location Bar */}
              {report.address && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{report.address}</span>
                </div>
              )}
            </div>

            {/* Bottom Verification & Confidence Metrics */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              
              {/* Confidence Meter */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400 font-semibold">Community Confidence</span>
                  <span className="font-mono font-bold text-cyan-400">{report.confidence_score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${report.confidence_score}%` }}
                  />
                </div>
              </div>

              {/* Upvote & Verify Action */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  By <strong className="text-slate-300">{report.user_name || 'Citizen'}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onVote(report.id, 'up')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      report.user_has_voted
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{report.upvotes}</span>
                  </button>

                  <button
                    onClick={() => onVote(report.id, 'verify')}
                    title="Corroborate / Verify physical ground condition"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
          <p className="text-slate-400 text-sm">No citizen reports matching selected filter.</p>
        </div>
      )}

    </div>
  );
};
