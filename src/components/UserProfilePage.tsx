import React, { useState } from 'react';
import { 
  UserProfile, 
  CitizenReport, 
  NavigationPage 
} from '../types';
import { 
  User, 
  Mail, 
  Award, 
  ShieldAlert, 
  Bookmark, 
  Sparkles, 
  Check, 
  LogOut, 
  Edit3, 
  Star,
  MapPin,
  Calendar,
  Compass
} from 'lucide-react';

interface Props {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  userReports: CitizenReport[];
  savedPlacesCount: number;
  savedItinerariesCount: number;
  onNavigate: (page: NavigationPage) => void;
  onOpenAuthModal: () => void;
}

export const UserProfilePage: React.FC<Props> = ({
  currentUser,
  onUpdateUser,
  userReports,
  savedPlacesCount,
  savedItinerariesCount,
  onNavigate,
  onOpenAuthModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute next badge milestone
  const getNextRank = (score: number) => {
    if (score < 25) return { next: 'Pathfinder', needed: 25 - score, max: 25 };
    if (score < 50) return { next: 'City Scout', needed: 50 - score, max: 50 };
    if (score < 100) return { next: 'Urban Legend', needed: 100 - score, max: 100 };
    return { next: 'Civic Architect', needed: 0, max: 250 };
  };

  const nextRank = getNextRank(currentUser.reputation_score);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      full_name: fullName.trim() || currentUser.full_name,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Profile Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.full_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-amber-400 shadow-glow-amber"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-950 text-amber-400 border border-amber-500/50">
                {currentUser.role}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-heading font-extrabold text-white">
                  {currentUser.full_name}
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1 text-slate-400 hover:text-amber-400"
                  title="Edit Profile"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400">{currentUser.email || 'explorer@explorecity.app'}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentUser.badge}</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  {currentUser.reputation_score} Reputation Points
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
            >
              Switch User
            </button>
          </div>

        </div>

        {/* Reputation Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Explorer Progression: <strong className="text-white">{currentUser.badge}</strong>
            </span>
            <span className="text-amber-400 font-mono font-bold">
              {nextRank.needed > 0 ? `${nextRank.needed} pts to ${nextRank.next}` : 'Top Rank Achieved!'}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (currentUser.reputation_score / nextRank.max) * 100)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Edit Form if toggled */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Edit Profile Details</h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full max-w-md px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Overview Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('saved')}
          className="glass-card p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Saved Places</span>
            <Bookmark className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{savedPlacesCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Stored in personal pocket</p>
        </div>

        <div 
          onClick={() => onNavigate('saved')}
          className="glass-card p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">AI Itineraries</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{savedItinerariesCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Weather-calibrated plans</p>
        </div>

        <div 
          onClick={() => onNavigate('reports')}
          className="glass-card p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-rose-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Civic Reports</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-white">{userReports.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">Submitted street conditions</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Reputation Rank</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-400 truncate">{currentUser.badge}</p>
          <p className="text-[10px] text-slate-500 mt-1">Verified civic contributor</p>
        </div>
      </div>

      {/* User Civic Activity Feed */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>My Civic Incident Submissions</span>
        </h3>

        {userReports.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/50 border border-slate-800">
            <p className="text-xs text-slate-400 mb-3">You haven't submitted any citizen reports yet.</p>
            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold"
            >
              Submit First Report (+15 pts)
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{report.title}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                      report.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{report.address}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {report.confidence_score}% Confidence
                  </span>
                  <p className="text-[10px] text-slate-500">{report.upvotes} Upvotes</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
