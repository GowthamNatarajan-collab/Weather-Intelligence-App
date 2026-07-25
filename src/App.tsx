import React, { useState, useEffect } from 'react';
import { CloudSun, Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';
import { City, WeatherData } from './types';
import WeatherSearch from './components/WeatherSearch';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherCharts from './components/WeatherCharts';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: City) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=${city.timezone}`;
      
      const response = await fetch(`/api/weather-proxy?url=${encodeURIComponent(url)}`);
      const data = await response.json() as any;

      if (data.error) {
        throw new Error(data.error);
      }

      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Default city (e.g., London)
    const defaultCity: City = {
      id: 2643743,
      name: "London",
      latitude: 51.5085,
      longitude: -0.1257,
      country: "United Kingdom",
      timezone: "Europe/London"
    };
    setSelectedCity(defaultCity);
    fetchWeather(defaultCity);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 p-4 md:p-8 selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-800/20 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-500/05 blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CloudSun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Atmosphere IQ</h1>
              <p className="text-xs text-blue-300/80 font-medium uppercase tracking-widest">Weather Intelligence Engine</p>
            </div>
          </div>
          <WeatherSearch onSelectCity={(city) => {
            setSelectedCity(city);
            fetchWeather(city);
          }} />
        </header>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
              <button 
                onClick={() => selectedCity && fetchWeather(selectedCity)}
                className="ml-auto p-2 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-zinc-500 font-medium animate-pulse">Analyzing atmospheric data...</p>
            </div>
          ) : weatherData && selectedCity ? (
            <motion.div
              key={selectedCity.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Top Row: Current Weather */}
              <div className="w-full">
                <CurrentWeather data={weatherData} city={selectedCity} />
              </div>

              {/* Middle Section: Forecast */}
              <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 text-blue-400" />
                  7-Day Outlook
                </h3>
                <Forecast data={weatherData} />
              </section>

              {/* Bottom Section: Charts */}
              <section>
                <WeatherCharts data={weatherData} />
              </section>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Footer */}
        <footer className="pt-12 pb-6 flex flex-col items-center gap-4 text-slate-500">
          <div className="h-px w-24 bg-white/10" />
          <p className="text-[10px] font-mono uppercase tracking-[0.3em]">
            Prototype V1.2.0 • Data Source: Open-Meteo API
          </p>
        </footer>
      </div>
    </div>
  );
}
