import React from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, CloudSnow, CloudLightning } from 'lucide-react';
import { WeatherData, City } from '../types';
import { motion } from 'motion/react';

interface CurrentWeatherProps {
  data: WeatherData;
  city: City;
}

export default function CurrentWeather({ data, city }: CurrentWeatherProps) {
  const getWeatherIcon = (code: number) => {
    if (code <= 3) return <Sun className="w-20 h-20 text-yellow-400" />;
    if (code <= 48) return <Cloud className="w-20 h-20 text-zinc-400" />;
    if (code <= 67) return <CloudRain className="w-20 h-20 text-blue-400" />;
    if (code <= 77) return <CloudSnow className="w-20 h-20 text-white" />;
    if (code <= 82) return <CloudRain className="w-20 h-20 text-blue-500" />;
    return <CloudLightning className="w-20 h-20 text-purple-400" />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Mainly Clear";
    if (code <= 48) return "Foggy/Cloudy";
    if (code <= 67) return "Drizzle/Rain";
    if (code <= 77) return "Snow Fall";
    if (code <= 82) return "Rain Showers";
    return "Thunderstorm";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
    >
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <p className="text-blue-300 font-semibold mb-1">{city.name}, {city.country}</p>
        <p className="text-xs text-slate-400 mb-6">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        
        <div className="flex items-baseline gap-2">
          <h2 className="text-7xl font-bold tracking-tighter text-slate-100">
            {Math.round(data.current.temperature_2m)}°<span className="text-4xl text-slate-400 font-medium">C</span>
          </h2>
        </div>
        <div className="mt-1 text-lg font-medium text-blue-200/80">
          {getWeatherDescription(data.current.weather_code)}
        </div>
      </div>

      <div className="flex-shrink-0 drop-shadow-2xl">
        {getWeatherIcon(data.current.weather_code)}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Humidity</p>
          <p className="text-xl font-bold text-slate-100">{data.current.relative_humidity_2m}%</p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Wind Speed</p>
          <p className="text-xl font-bold text-slate-100">{data.current.wind_speed_10m}<span className="text-xs ml-1 font-medium">km/h</span></p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Feels Like</p>
          <p className="text-xl font-bold text-slate-100">{Math.round(data.current.apparent_temperature)}°</p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Precipitation</p>
          <p className="text-xl font-bold text-slate-100">{data.current.precipitation}<span className="text-xs ml-1 font-medium">mm</span></p>
        </div>
      </div>
    </motion.div>
  );
}
