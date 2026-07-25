import React from 'react';
import { WeatherData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'motion/react';

interface WeatherChartsProps {
  data: WeatherData;
}

export default function WeatherCharts({ data }: WeatherChartsProps) {
  const hourlyData = data.hourly.time.slice(0, 24).map((time, i) => ({
    time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: data.hourly.temperature_2m[i],
    precip: data.hourly.precipitation_probability[i],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">Temperature Trends</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-tight">24-hour variation analysis</p>
          </div>
          <div className="text-[10px] px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg font-bold">LIVE</div>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                interval={4}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#60a5fa" 
                fillOpacity={1} 
                fill="url(#colorTemp)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">Rain Probability</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-tight">Forecasted precipitation chance</p>
          </div>
          <div className="text-[10px] px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg font-bold">PRECIP</div>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                interval={4}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Line 
                type="monotone" 
                dataKey="precip" 
                stroke="#22d3ee" 
                strokeWidth={3} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
