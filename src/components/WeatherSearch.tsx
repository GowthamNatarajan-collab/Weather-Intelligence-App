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
        return;
      }

      setIsLoading(true);
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        const response = await fetch(`/api/weather-proxy?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
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

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {results.map((city) => (
            <button
              key={city.id}
              className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 group border-b border-white/5 last:border-0"
              onClick={() => {
                onSelectCity(city);
                setQuery('');
                setIsOpen(false);
              }}
            >
              <MapPin className="w-4 h-4 text-zinc-500 group-hover:text-blue-500" />
              <div>
                <div className="text-zinc-100 font-medium">{city.name}</div>
                <div className="text-xs text-zinc-500">
                  {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
