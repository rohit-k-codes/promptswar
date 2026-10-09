import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  CloudSun, 
  Bookmark, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Check,
  AlertTriangle,
  IndianRupee,
  Clock
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
  const [destination, setDestination] = useState('Pune, Maharashtra');
  const [durationHours, setDurationHours] = useState(6);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('moderate');
  const [budgetInr, setBudgetInr] = useState<number>(1500);
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFoodPreferences, setSelectedFoodPreferences] = useState<string[]>([
    'irani_chai',
    'puneri_misal'
  ]);
  const [selectedTravelStyle, setSelectedTravelStyle] = useState<string>('relaxed');

  const interestOptions = [
    { id: 'heritage', label: '🏛️ Peshwa Heritage & Forts' },
    { id: 'local_food', label: '🍛 Iconic Puneri Food Trails' },
    { id: 'scenic_walk', label: '🌿 Koregaon Park & Zen Gardens' },
    { id: 'art', label: '🎨 Kelkar Museum & Antiques' },
    { id: 'viewpoints', label: '🌄 Vetal Tekdi & Parvati Hills' },
    { id: 'college_katta', label: '☕ FC Road College Katta & Chai' },
    { id: 'peth_culture', label: '🏮 Historic Peth Bazaars' },
  ];

  const foodOptions = [
    { id: 'irani_chai', label: '☕ Bun Maska & Irani Chai (Goodluck)' },
    { id: 'puneri_misal', label: '🌶️ Authentic Puneri Misal (Bedekar/Katakirr)' },
    { id: 'spdp_dosa', label: '🥞 SPDP & Filter Coffee (Vaishali)' },
    { id: 'shrewsbury', label: '🍪 Shrewsbury Biscuits & Mawa Cake (Kayani)' },
    { id: 'mastani_shake', label: '🍨 Royal Mastani Ice Cream (Sujata)' },
    { id: 'maharashtrian_thali', label: '🍱 Authentic Maharashtrian Thali' },
  ];

  const travelStyleOptions = [
    { id: 'relaxed', label: '🌿 Relaxed & Leisurely', desc: 'Unhurried pace, ample Irani cafe rest stops' },
    { id: 'high_tempo', label: '⚡ High-Tempo Discovery', desc: 'Maximum historical forts & monuments' },
    { id: 'hidden_gems', label: '🕵️ Hidden-Gem Seeker', desc: 'Subterranean caves & 8th-century basalt' },
    { id: 'budget_backpacker', label: '🎒 Budget Backpacker', desc: 'Walkable FC Road corridors & free parks' },
  ];

  const accessibilityOptions = [
    { id: 'step_free_options', label: '♿ Step-Free / Wheelchair Ramps' },
    { id: 'shaded_rest_stops', label: '🌳 Shaded Benches & Green Corridors' },
    { id: 'transit_accessible', label: '🚊 Near Pune Metro / PMPML Station' },
    { id: 'quiet_zones', label: '🎧 Low Noise / Tranquil Zen Zones' },
  ];

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleFoodPreference = (id: string) => {
    setSelectedFoodPreferences(prev => 
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
        budgetInr,
        budgetTier,
        interests: selectedInterests,
        foodPreferences: selectedFoodPreferences,
        travelStyle: selectedTravelStyle,
        accessibilityOptions: selectedAccessibility,
        weather,
      });
      setCurrentItinerary(plan);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmSave = () => {
    if (currentItinerary) {
      onSaveItinerary(currentItinerary);
      setSaveSuccess(true);
      setShowConfirmModal(false);
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
              Pune AI Adventure Planner
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Curate an authentic day in Pune calibrated for your INR budget, mobility preferences, and live Deccan weather. Grounded in real Pune places. Zero paid APIs.
            </p>
          </div>

          {/* Weather Context Card */}
          <div className="glass-card p-4 rounded-xl border border-slate-700 flex items-center gap-4 min-w-[260px]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
              {weather.icon}
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Live Pune Weather</p>
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
                  placeholder="e.g. Pune, Maharashtra"
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

            {/* Target Budget in INR */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Target Budget (INR ₹)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { amount: 500, label: '₹500', tier: 'budget' as const },
                  { amount: 1500, label: '₹1,500', tier: 'moderate' as const },
                  { amount: 3500, label: '₹3,500', tier: 'luxury' as const },
                  { amount: 6000, label: '₹6,000+', tier: 'flexible' as const },
                ].map((b) => (
                  <button
                    key={b.amount}
                    type="button"
                    onClick={() => {
                      setBudgetInr(b.amount);
                      setBudgetTier(b.tier);
                    }}
                    className={`p-2.5 rounded-xl text-center border transition-all ${
                      budgetInr === b.amount
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-glow-amber'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-mono font-bold">{b.label}</p>
                    <p className="text-[10px] opacity-75 capitalize">{b.tier}</p>
                  </button>
                ))}
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="number"
                  min="200"
                  max="50000"
                  step="100"
                  value={budgetInr}
                  onChange={(e) => setBudgetInr(Math.max(100, Number(e.target.value)))}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  placeholder="Custom INR budget"
                />
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

            {/* Food Preferences Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Pune Food & Specialties
              </label>
              <div className="flex flex-wrap gap-2">
                {foodOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFoodPreference(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedFoodPreferences.includes(f.id)
                        ? 'bg-amber-500/25 text-amber-300 border-amber-500/60 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Exploration & Travel Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {travelStyleOptions.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedTravelStyle(style.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedTravelStyle === style.id
                        ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 font-bold'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <p className="text-xs leading-snug">{style.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{style.desc}</p>
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
                  <span>Synthesizing Pune Adventure via Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate Pune AI Itinerary</span>
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
                      {currentItinerary.duration_hours} Hours Exploration
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-emerald-400 font-semibold font-mono">
                      Target Budget: ₹{currentItinerary.estimated_cost} INR
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
                    onClick={() => setShowConfirmModal(true)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      saveSuccess || isSaved(currentItinerary.id)
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saveSuccess || isSaved(currentItinerary.id) ? 'Saved Locally' : 'Review & Save'}</span>
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
                          <span><strong className="text-emerald-400">Pune Tip:</strong> {step.safety_tip}</span>
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
              <h3 className="text-lg font-bold text-white">Your Pune Adventure Awaits</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
                Configure your exploration duration, interests, and INR budget preferences on the left to synthesize a genuine Pune itinerary.
              </p>
              <button
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-amber hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Generate Pune Heritage &amp; Food Odyssey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Explicit User Review & Confirmation Modal before saving locally */}
      {showConfirmModal && currentItinerary && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Bookmark className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Confirm Saving Itinerary</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are about to save <strong>"{currentItinerary.title}"</strong> ({currentItinerary.schedule.length} stops) to your local browser storage.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl text-[11px] text-slate-400 space-y-1">
              <p>• Destination: Pune, Maharashtra</p>
              <p>• Estimated Budget: ₹{currentItinerary.estimated_cost} INR</p>
              <p>• Saved locally in this browser. No external cloud transmission.</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-amber hover:bg-amber-400 transition"
              >
                Confirm &amp; Save Locally
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
