import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { City } from '../types';
import { cn } from '../lib/utils';

interface WeatherSearchProps {
  onSelectCity: (city: City) => void;
}

export default function WeatherSearch({ onSelectCity }: WeatherSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        const response = await fetch(`/api/weather-proxy?url=${encodeURIComponent(url)}`);
        const data = await response.json() as any;
        
        if (data.results && data.results.length > 0) {
          setResults(data.results);
          setIsOpen(true);
        } else {
          setResults([]);
          setIsOpen(true); // Show the "no results" state
        }
      } catch (error) {
        console.error('Search error:', error);
        setError("Failed to search cities");
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-md"
          placeholder="Search city (e.g. San Francisco)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] backdrop-blur-xl">
          {error ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-semibold text-red-400">{error}</p>
            </div>
          ) : results.length > 0 ? (
            results.map((city) => (
              <button
                key={city.id}
                className="w-full px-5 py-4 text-left hover:bg-blue-600/20 transition-all flex items-center gap-4 group border-b border-white/5 last:border-0"
                onClick={() => {
                  onSelectCity(city);
                  setQuery('');
                  setIsOpen(false);
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <MapPin className="w-5 h-5 text-zinc-400 group-hover:text-blue-400" />
                </div>
                <div>
                  <div className="text-zinc-100 font-bold group-hover:text-white transition-colors">{city.name}</div>
                  <div className="text-sm text-zinc-500 group-hover:text-zinc-400">
                    {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                  </div>
                </div>
              </button>
            ))
          ) : !isLoading ? (
            <div className="px-4 py-8 text-center bg-zinc-900/50">
              <p className="text-sm font-medium text-zinc-400">No results found for "<span className="text-zinc-100 font-bold">{query}</span>"</p>
              <p className="text-xs text-zinc-500 mt-1">Try a different city name</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
