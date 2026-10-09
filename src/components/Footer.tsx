import { Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-header border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 via-amber-500 to-cyan-400 p-0.5 shadow-glow-amber">
            <div className="w-full h-full bg-brand-dark rounded-[6px] flex items-center justify-center">
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <p className="font-heading font-extrabold text-sm text-white">
              Explore<span className="text-gradient-amber">City</span>
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              Less Survival Mode. <span className="text-cyan-400">More Adventure.</span>
            </p>
          </div>
        </div>

        {/* Data Provenance Notice */}
        <div className="text-center md:text-left max-w-md">
          <p className="text-[11px] leading-relaxed text-slate-400">
            Evidence-based urban decision support. Sourced via Google Maps Platform, municipal feeds, and moderated citizen reports.
          </p>
        </div>

        {/* Stack & License */}
        <div className="text-center md:text-right">
          <p className="text-[11px] text-slate-400">
            Built with React, TypeScript, Tailwind CSS, Supabase & Gemini AI
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            © 2026 Explore City · Hackathon Edition
          </p>
        </div>

      </div>
    </footer>
  );
};
