import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  CloudSun, 
  Bookmark, 
  MapPin, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { BudgetTier, Itinerary, WeatherData } from '../types';
import { generateAITripPlan } from '../services/geminiService';

interface Props {
  weather: WeatherData;
  onSaveItinerary: (itinerary: Itinerary) => void;
  isSaved: (itineraryId: string) => boolean;
}

export const TripPlannerView: React.FC<Props> = ({
  weather,
  onSaveItinerary,
  isSaved,
}) => {
  const [destination, setDestination] = useState('San Francisco, CA');
  const [durationHours, setDurationHours] = useState(6);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('moderate');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'heritage',
    'local_food',
    'scenic_walk'
  ]);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([
    'step_free_options'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const interestOptions = [
    { id: 'heritage', label: '🏛️ Heritage & History' },
    { id: 'local_food', label: '🥐 Local Food & Bakeries' },
    { id: 'scenic_walk', label: '🌊 Waterfront Promenades' },
    { id: 'art', label: '🎨 Street Art & Murals' },
    { id: 'viewpoints', label: '🌄 Skyline Hill Vistas' },
    { id: 'hidden_gems', label: '🔍 Secret Rooftops' },
    { id: 'nightlife', label: '🍸 Evening Lounges' },
  ];

  const accessibilityOptions = [
    { id: 'step_free_options', label: '♿ Step-Free / Wheelchair Ramps' },
    { id: 'shaded_rest_stops', label: '🌳 Shaded Benches & Rest Stops' },
    { id: 'transit_accessible', label: '🚊 Direct Transit / Elevator Access' },
    { id: 'quiet_zones', label: '🎧 Low Noise / Sensory Friendly' },
  ];

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAccessibility = (id: string) => {
    setSelectedAccessibility(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSaveSuccess(false);
    try {
      const plan = await generateAITripPlan({
        destination,
        durationHours,
        budgetTier,
        interests: selectedInterests,
        accessibilityOptions: selectedAccessibility,
        weather,
      });
      setCurrentItinerary(plan);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (currentItinerary) {
      onSaveItinerary(currentItinerary);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 mb-8 border border-slate-700/80 shadow-glass">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.8 Flash Neural Itinerary Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              AI Urban Adventure Planner
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Curate an authentic day in the city calibrated for your budget, mobility preferences, and live coastal weather. No tourist traps. Zero survival anxiety.
            </p>
          </div>

          {/* Weather Context Card */}
          <div className="glass-card p-4 rounded-xl border border-slate-700 flex items-center gap-4 min-w-[260px]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
              {weather.icon}
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Live City Weather</p>
              <p className="text-lg font-bold text-white mt-0.5">{weather.temp_c}°C / {weather.temp_f}°F</p>
              <p className="text-xs text-emerald-400 font-medium">{weather.condition}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Configuration Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            
            {/* Destination Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                City / Exploration Hub
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Exploration Duration
                </label>
                <span className="text-sm font-extrabold text-amber-400 font-mono">
                  {durationHours} Hours
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Quick Tour (2h)</span>
                <span>Half Day (6h)</span>
                <span>Full Day (12h)</span>
              </div>
            </div>

            {/* Budget Tier Buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Budget Calibration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'budget' as const, label: 'Budget', sub: '$' },
                  { id: 'moderate' as const, label: 'Standard', sub: '$$' },
                  { id: 'luxury' as const, label: 'Premium', sub: '$$$$' },
                  { id: 'flexible' as const, label: 'Free Spirit', sub: '∞' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setBudgetTier(tier.id)}
                    className={`p-2.5 rounded-xl text-center border transition-all ${
                      budgetTier === tier.id
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-glow-amber'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs leading-none">{tier.label}</p>
                    <p className="text-[11px] font-mono opacity-80 mt-1">{tier.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Adventure Themes & Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedInterests.includes(opt.id)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility Checkboxes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Accessibility & Comfort
              </label>
              <div className="space-y-2">
                {accessibilityOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccessibility.includes(opt.id)}
                      onChange={() => toggleAccessibility(opt.id)}
                      className="rounded accent-amber-500"
                    />
                    <span className="text-xs text-slate-300 font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-brand-500 to-cyan-500 text-slate-950 font-extrabold text-sm shadow-glow-amber hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Tailored Adventure...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate AI Itinerary</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Output Timetable Column */}
        <div className="lg:col-span-7">
          {currentItinerary ? (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              
              {/* Itinerary Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {currentItinerary.duration_hours} Hours Odyssey
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      Estimated Cost: ${currentItinerary.estimated_cost}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                    {currentItinerary.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentItinerary.destination}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      saveSuccess || isSaved(currentItinerary.id)
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saveSuccess || isSaved(currentItinerary.id) ? 'Saved' : 'Save Plan'}</span>
                  </button>
                </div>
              </div>

              {/* Weather Calibration Note */}
              {currentItinerary.weather_context && (
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-3">
                  <CloudSun className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Weather-Adapted Routine</p>
                    <p className="mt-0.5 leading-relaxed text-cyan-200/90">
                      {currentItinerary.weather_context.recommendation}
                    </p>
                  </div>
                </div>
              )}

              {/* Day Schedule Timeline */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                {currentItinerary.schedule.map((step) => (
                  <div key={step.step} className="relative group">
                    
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center shadow-glow-amber">
                      <span className="text-[9px] font-bold text-amber-400">{step.step}</span>
                    </div>

                    {/* Step Card */}
                    <div className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800/80 group-hover:border-amber-500/30 transition-all">
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {step.time}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300">
                            {step.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                          <span>{step.duration}</span>
                          <span className="text-slate-600">·</span>
                          <span className="font-bold">{step.cost_estimate}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{step.location}</span>
                      </p>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {step.notes}
                      </p>

                      {/* Safety Tip Pill */}
                      {step.safety_tip && (
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong className="text-emerald-400">Safety Tip:</strong> {step.safety_tip}</span>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                <Compass className="w-8 h-8 animate-pulse-slow" />
              </div>
              <h3 className="text-lg font-bold text-white">Your Itinerary Awaits</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
                Configure your exploration duration, interests, and budget preferences on the left to synthesize an adaptive city adventure plan.
              </p>
              <button
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-amber hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Generate Default SF Odyssey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
