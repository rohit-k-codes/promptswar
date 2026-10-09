import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  AlertTriangle, 
  ShieldAlert, 
  Check
} from 'lucide-react';
import { ReportCategory, ReportSeverity, CitizenReport } from '../types';
import { submitCitizenReport, findPotentialDuplicates } from '../services/citizenReportService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  allReports: CitizenReport[];
  onReportCreated: (newReport: CitizenReport) => void;
  initialCoords?: { lat: number; lng: number };
  initialDraft?: { title?: string; description?: string; category?: ReportCategory };
}

export const ReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  allReports,
  onReportCreated,
  initialCoords,
  initialDraft,
}) => {
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [description, setDescription] = useState(initialDraft?.description || '');
  const [category, setCategory] = useState<ReportCategory>(initialDraft?.category || 'safety_concern');
  const [severity, setSeverity] = useState<ReportSeverity>('medium');
  const [lat, setLat] = useState<number>(initialCoords?.lat || 18.5204);
  const [lng, setLng] = useState<number>(initialCoords?.lng || 73.8567);
  const [address, setAddress] = useState('FC Road / Deccan Gymkhana, Pune');
  const [imageUrl, setImageUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [potentialDuplicates, setPotentialDuplicates] = useState<CitizenReport[]>([]);

  useEffect(() => {
    if (initialDraft) {
      if (initialDraft.title) setTitle(initialDraft.title);
      if (initialDraft.description) setDescription(initialDraft.description);
      if (initialDraft.category) setCategory(initialDraft.category);
    }
  }, [initialDraft]);

  useEffect(() => {
    if (initialCoords) {
      setLat(initialCoords.lat);
      setLng(initialCoords.lng);
      setAddress(`${initialCoords.lat.toFixed(4)}, ${initialCoords.lng.toFixed(4)}`);
    }
  }, [initialCoords]);

  // Check for duplicates in real-time as coordinates or category change
  useEffect(() => {
    const dupes = findPotentialDuplicates(lat, lng, category, allReports);
    setPotentialDuplicates(dupes);
  }, [lat, lng, category, allReports]);

  // Web Speech API speech-to-text handler
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type directly.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await submitCitizenReport({
        title,
        description,
        category,
        severity,
        lat,
        lng,
        address,
        image_url: imageUrl.trim() || undefined,
        voice_transcript: voiceTranscript.trim() || undefined,
      });
      onReportCreated(result.report);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-extrabold text-white">
                Submit Citizen Report
              </h2>
              <p className="text-[11px] text-slate-400">
                Help fellow explorers with transparent street condition & safety intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          
          {/* Duplicate Detection Alert */}
          {potentialDuplicates.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs">
              <div className="flex items-center gap-2 font-bold mb-1 text-amber-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Potential Duplicate Incident Nearby ({potentialDuplicates.length})</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed mb-2">
                A similar report was already logged within 200m: <em>"{potentialDuplicates[0].title}"</em>.
              </p>
              <p className="text-[10px] text-amber-400">
                Tip: Submitting will link this as corroborating evidence or you can upvote the existing report.
              </p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Incident or Discovery Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken Streetlight on 19th & Mission"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
            />
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
              >
                <option value="safety_concern">⚠️ Safety Concern</option>
                <option value="street_light">💡 Broken Streetlight</option>
                <option value="pothole">🕳️ Pothole / Road Hazard</option>
                <option value="transit_delay">🚊 Transit Delay / Work</option>
                <option value="crowd_surge">👥 Crowd Surge</option>
                <option value="festival_event">🎉 Festival / Pop-up</option>
                <option value="heritage_tip">🏛️ Heritage Access Tip</option>
                <option value="accessibility_barrier">♿ Accessibility Barrier</option>
                <option value="other">📌 Other City Note</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Urgency Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
              >
                <option value="low">Low (General Tip / Notice)</option>
                <option value="medium">Medium (Moderate Inconvenience)</option>
                <option value="high">High (Active Road/Pedestrian Hazard)</option>
                <option value="critical">Critical (Immediate Danger)</option>
              </select>
            </div>
          </div>

          {/* Description & Voice-to-Text Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Detailed Description *
              </label>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Listening...' : 'Dictate with Voice'}</span>
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact physical context, hazard size, pedestrian impacts, or recommendations..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
            />
            {voiceTranscript && (
              <p className="text-[11px] text-cyan-300 mt-1 italic">
                Transcribed: "{voiceTranscript}"
              </p>
            )}
          </div>

          {/* Location & Coordinates */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Location Coordinates
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                placeholder="Latitude"
              />
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                placeholder="Longitude"
              />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              placeholder="Street Address or Cross Street landmark"
            />
          </div>

          {/* Optional Photo URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Photo URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 text-slate-950 font-bold text-sm shadow-glow-amber hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Analyzing Report via Gemini 3.8 Flash...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Local Report (Browser Storage Only)</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              🔒 Privacy Notice: Local citizen reports are saved exclusively in your browser's localStorage for neighborhood awareness. They are <strong>unverified</strong> and are <strong>not submitted</strong> to municipal or emergency authorities.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
