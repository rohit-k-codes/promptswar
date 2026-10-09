import React from 'react';
import { CitizenReport, Place } from '../types';
import { 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Activity,
  Layers,
  Clock,
  PieChart
} from 'lucide-react';

interface Props {
  reports: CitizenReport[];
  places: Place[];
}

export const CityInsightsDashboard: React.FC<Props> = ({
  reports,
  places,
}) => {
  const totalReports = reports.length;
  const approvedReports = reports.filter(r => r.status === 'approved');
  const pendingReports = reports.filter(r => r.status === 'pending');
  const duplicateReports = reports.filter(r => r.duplicate_of);
  const criticalReports = reports.filter(r => r.severity === 'high' || r.severity === 'critical');

  // Category counts
  const categoryCounts: Record<string, number> = {};
  reports.forEach(r => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat.replace('_', ' '),
    count,
    percentage: Math.round((count / (totalReports || 1)) * 100),
  })).sort((a, b) => b.count - a.count);

  // Compute average metrics from curated places
  const avgSafety = (places.reduce((acc, p) => acc + p.safety_score, 0) / (places.length || 1)).toFixed(1);
  const avgCleanliness = (places.reduce((acc, p) => acc + p.cleanliness_score, 0) / (places.length || 1)).toFixed(1);
  const avgWalkability = (places.reduce((acc, p) => acc + p.walkability_score, 0) / (places.length || 1)).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/80 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Civic Pulse & Telemetry Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              City Insights &amp; Report Summaries
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Aggregated infrastructure condition telemetry, citizen incident distributions, and verified neighborhood safety scores.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Ledger Reliability</p>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">Local Persistence</p>
            <p className="text-[9px] text-slate-500">Browser Storage • Pune Hub</p>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Reports</p>
          <p className="text-3xl font-extrabold text-white mt-1">{totalReports}</p>
          <p className="text-[11px] text-emerald-400 mt-1">
            {approvedReports.length} Approved &amp; Live on Map
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Pending Review</p>
          <p className="text-3xl font-extrabold text-amber-400 mt-1">{pendingReports.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">In moderation desk queue</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Duplicate Clustered</p>
          <p className="text-3xl font-extrabold text-cyan-400 mt-1">{duplicateReports.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Geospatial radius &lt;200m</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">High Urgency</p>
          <p className="text-3xl font-extrabold text-rose-400 mt-1">{criticalReports.length}</p>
          <p className="text-[11px] text-rose-400/80 mt-1">Priority safety alerts</p>
        </div>
      </div>

      {/* Visual Charts & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-400" />
              <span>Incident Category Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Aggregation</span>
          </div>

          <div className="space-y-4">
            {categoryData.map((item, idx) => {
              const colors = ['bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-emerald-500'];
              const color = colors[idx % colors.length];

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 font-semibold capitalize">{item.category}</span>
                    <span className="text-slate-400 font-mono">{item.count} reports ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(5, item.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neighborhood Livability Scorecard */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-2">
              <Activity className="w-4 h-4" />
              <span>Urban Quality Telemetry</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Neighborhood Quality Index
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Averages computed across verified destination points in Pune (Deccan Gymkhana, FC Road, Shivajinagar, Koregaon Park).
            </p>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Evidence Safety Index</p>
                  <p className="text-[10px] text-slate-500">Based on street condition & lighting</p>
                </div>
                <span className="text-lg font-bold text-emerald-400 font-mono">{avgSafety} / 10</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Cleanliness Rating</p>
                  <p className="text-[10px] text-slate-500">Sanitation and waste management</p>
                </div>
                <span className="text-lg font-bold text-cyan-400 font-mono">{avgCleanliness} / 10</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Sidewalk Walkability</p>
                  <p className="text-[10px] text-slate-500">Crosswalks, ramps, pedestrian spaces</p>
                </div>
                <span className="text-lg font-bold text-indigo-400 font-mono">{avgWalkability} / 10</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 italic mt-4">
            Notice: Safety metrics are decision support tools. Always exercise personal situational awareness.
          </div>
        </div>

      </div>

      {/* Safety Report Summaries Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Recent Incident & Advisory Summaries</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{reports.length} Reports Logged</span>
        </div>

        <div className="space-y-3">
          {reports.map((report) => (
            <div 
              key={report.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    {report.category.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                    report.severity === 'high' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {report.severity}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400">{report.address}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{report.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-1">{report.description}</p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {report.confidence_score}% Confidence
                </span>
                <span className="text-[10px] text-slate-500">
                  {report.upvotes} Community Votes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
