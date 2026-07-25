import React from 'react';
import { WeatherData } from '../types';
import { motion } from 'motion/react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

interface ForecastProps {
  data: WeatherData;
}

export default function Forecast({ data }: ForecastProps) {
  const getIcon = (code: number) => {
    if (code <= 3) return <Sun className="w-6 h-6 text-yellow-400" />;
    if (code <= 48) return <Cloud className="w-6 h-6 text-zinc-400" />;
    if (code <= 67) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (code <= 77) return <CloudSnow className="w-6 h-6 text-white" />;
    if (code <= 82) return <CloudRain className="w-6 h-6 text-blue-500" />;
    return <CloudLightning className="w-6 h-6 text-purple-400" />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
      {data.daily.time.map((time, i) => (
        <motion.div
          key={time}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-between text-center gap-3 hover:bg-white/10 transition-all hover:scale-[1.02]"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{i === 0 ? 'Today' : formatDate(time)}</div>
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 shadow-inner">
            {getIcon(data.daily.weather_code[i])}
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-100">{Math.round(data.daily.temperature_2m_max[i])}°</span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{Math.round(data.daily.temperature_2m_min[i])}° Min</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
