'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Leaf, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, Activity, Trash2, RefreshCw, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface FootprintRecord {
  id: string;
  createdAt: string;
  monthlyFootprint: number;
  annualFootprint: number;
  transportation: number;
  electricity: number;
  food: number;
  waste: number;
}

type ChartType = 'LineChart' | 'BarChart' | 'PieChart' | 'AreaChart';

export function FootprintHistory() {
  const [history, setHistory] = useState<FootprintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<ChartType>('LineChart');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/footprint');
      if (response.ok) {
        const data = await response.json();
        setHistory(data.sort((a: FootprintRecord, b: FootprintRecord) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all your past footprint history? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch('/api/footprint', { method: 'DELETE' });
      if (res.ok) {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to delete history", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const timeSeriesData = history.map(record => ({
    name: format(new Date(record.createdAt), 'MMM d'),
    value: Number((record.monthlyFootprint || 0).toFixed(2)),
  }));

  const latest = history[history.length - 1];
  const pieData = history.length > 0 ? [
    { name: 'Transportation', value: Number((latest.transportation || 0).toFixed(2)), color: '#3b82f6' },
    { name: 'Electricity', value: Number((latest.electricity || 0).toFixed(2)), color: '#eab308' },
    { name: 'Food', value: Number((latest.food || 0).toFixed(2)), color: '#f97316' },
    { name: 'Waste', value: Number((latest.waste || 0).toFixed(2)), color: '#78716c' },
  ].filter(item => item.value > 0) : [];

  const CustomTooltipStyle = {
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(10,10,10,0.85)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    color: '#fff',
    backdropFilter: 'blur(8px)',
  };

  const renderChart = () => {
    if (chartType === 'PieChart') {
      if (pieData.length === 0) return <p className="text-muted-foreground font-mono">No category data available for the latest record.</p>;
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={isFullscreen ? 100 : 60}
              outerRadius={isFullscreen ? 160 : 100}
              paddingAngle={5}
              dataKey="value"
              stroke="transparent"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={CustomTooltipStyle}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              formatter={(value: number) => [`${value} kg CO₂e`, 'Emissions']}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'BarChart' ? (
          <BarChart data={timeSeriesData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip cursor={{ fill: 'rgba(34,197,94,0.1)' }} contentStyle={CustomTooltipStyle} formatter={(value: number) => [`${value} kg CO₂e`, 'Monthly Footprint']} />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : chartType === 'AreaChart' ? (
          <AreaChart data={timeSeriesData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip contentStyle={CustomTooltipStyle} formatter={(value: number) => [`${value} kg CO₂e`, 'Monthly Footprint']} />
            <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        ) : (
          <LineChart data={timeSeriesData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip contentStyle={CustomTooltipStyle} formatter={(value: number) => [`${value} kg CO₂e`, 'Monthly Footprint']} />
            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={{ r: 5, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    );
  };

  const Content = () => (
    <div className="space-y-6 flex flex-col h-full">
      {/* Header Row: Title on Left, Actions on Right */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {!isFullscreen && (
          <h2 className="text-xl font-semibold text-muted-foreground group-hover:text-blue-500 transition-colors">Visualizations</h2>
        )}
        
        <div className={`flex gap-2 ${isFullscreen ? 'ml-auto' : ''}`}>
          <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading} className="gap-2 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30 transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="gap-2 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-all">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Minimize" : "Full Screen"}</span>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearHistory} disabled={isDeleting} className="gap-2 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">{isDeleting ? "Deleting..." : "Clear"}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-muted/30 p-2 rounded-xl border">
        {/* Chart Type Toggles */}
        <div className="flex gap-2 w-full justify-between sm:justify-start overflow-x-auto pb-2 sm:pb-0">
          <Button variant={chartType === 'LineChart' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('LineChart')} className="flex items-center gap-2 transition-all hover:scale-105">
            <LineChartIcon className="w-4 h-4" /> <span className="hidden sm:inline">Trend</span>
          </Button>
          <Button variant={chartType === 'BarChart' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('BarChart')} className="flex items-center gap-2 transition-all hover:scale-105">
            <BarChart2 className="w-4 h-4" /> <span className="hidden sm:inline">Compare</span>
          </Button>
          <Button variant={chartType === 'AreaChart' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('AreaChart')} className="flex items-center gap-2 transition-all hover:scale-105">
            <Activity className="w-4 h-4" /> <span className="hidden sm:inline">Volume</span>
          </Button>
          <Button variant={chartType === 'PieChart' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('PieChart')} className="flex items-center gap-2 transition-all hover:scale-105">
            <PieChartIcon className="w-4 h-4" /> <span className="hidden sm:inline">Breakdown</span>
          </Button>
        </div>
      </div>

      <div className={`rounded-xl border border-blue-500/30 bg-card p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-700 flex items-center justify-center relative overflow-hidden group ${isFullscreen ? 'h-full min-h-[60vh]' : 'h-[350px] hover:shadow-[0_0_35px_rgba(59,130,246,0.3)] hover:-translate-y-1'}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-blue-500/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="relative w-full h-full z-10 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
               <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
               <p className="text-blue-500 animate-pulse font-mono uppercase tracking-widest text-sm">Loading Visualizations...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center">
              <p className="text-sm font-bold text-blue-500/70">AWAITING DATA</p>
              <p className="text-xs text-muted-foreground mt-2">Calculate footprint to activate.</p>
            </div>
          ) : renderChart()}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Placeholder to prevent layout collapse and screen shaking when going full screen */}
      {isFullscreen && <div className="w-full h-[400px]" />}
      
      <div className={isFullscreen ? "fixed inset-0 z-[100] bg-background w-full h-full p-6 sm:p-12 overflow-y-auto animate-in fade-in zoom-in-95 duration-200" : "w-full"}>
        <div className={isFullscreen ? "max-w-7xl mx-auto h-full flex flex-col" : "w-full"}>
          {isFullscreen && (
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-blue-500/20">
              <div className="p-2 bg-blue-500/20 rounded-lg"><BarChart2 className="w-6 h-6 text-blue-500" /></div>
              <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">Visualizations Studio</h2>
            </div>
          )}
          <Content />
        </div>
      </div>
    </>
  );
}
