import React from 'react';
import { DataSourceType } from '../types';
import { ShieldCheck, Database, Users, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  source: DataSourceType;
  timestamp?: string;
  className?: string;
  showTimestamp?: boolean;
}

export const ProvenanceBadge: React.FC<Props> = ({ 
  source, 
  timestamp, 
  className = '',
  showTimestamp = false 
}) => {
  const getBadgeConfig = () => {
    switch (source) {
      case 'official_google_places':
        return {
          label: 'Official Google Places',
          icon: <Database className="w-3.5 h-3.5 text-blue-400" />,
          classes: 'bg-blue-950/60 text-blue-300 border-blue-500/30',
          tooltip: 'Verified data synchronized with Google Places Platform API.'
        };
      case 'official_feed':
        return {
          label: 'Official Municipal Feed',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />,
          classes: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
          tooltip: 'Direct feed from municipal transit or meteorological authorities.'
        };
      case 'citizen_community':
        return {
          label: 'Community Report',
          icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
          classes: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
          tooltip: 'Submitted by citizens; verified through community consensus & moderation.'
        };
      case 'municipal_sensor':
        return {
          label: 'IoT Urban Sensor',
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
          classes: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
          tooltip: 'Automated civic telemetry & acoustic sensors.'
        };
      case 'demo_fallback':
      default:
        return {
          label: 'Simulated Demo Data',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
          classes: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
          tooltip: 'Local verified simulation dataset while live API key is unconfigured.'
        };
    }
  };

  const config = getBadgeConfig();

  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : null;

  return (
    <span 
      title={config.tooltip}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all ${config.classes} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
      {showTimestamp && formattedTime && (
        <span className="opacity-60 text-[10px] ml-1">· {formattedTime}</span>
      )}
    </span>
  );
};
