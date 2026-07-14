import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  AreaChart, Area, BarChart, Bar, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Custom Tooltip component for beautiful glassmorphism style
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 border rounded-xl glass-panel border-white/10 text-xs">
        <p className="font-semibold text-slate-300 mb-1.5">{label}</p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-400">{item.name}:</span>
            <span className="font-bold text-slate-100">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Worm Graph
export const WormGraph: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="over" stroke="#64748b" fontSize={10} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Line 
            type="monotone" 
            dataKey="team_a_runs" 
            name="India" 
            stroke="#0ea5e9" 
            strokeWidth={3} 
            dot={{ r: 2 }} 
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="team_b_runs" 
            name="Australia" 
            stroke="#f59e0b" 
            strokeWidth={3} 
            dot={{ r: 2 }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Win Probability Area Chart
export const WinProbabilityChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="over" stroke="#64748b" fontSize={10} tickLine={false} />
          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="intensity" 
            name="Win Prob (IND %)" 
            stroke="#0ea5e9" 
            fillOpacity={0.15} 
            fill="url(#colorWin)" 
          />
          <defs>
            <linearGradient id="colorWin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Partnerships Bar Chart
export const PartnershipsChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
          <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
          <YAxis dataKey="players" type="category" stroke="#64748b" fontSize={9} tickLine={false} width={130} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="runs" name="Runs" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 4. Radar Comparison Chart
export const RadarComparisonChart: React.FC<{ data: any[]; player1Name: string; player2Name: string }> = ({
  data,
  player1Name,
  player2Name
}) => {
  // Normalize comparison metrics (avg, strike rate, hundreds)
  const normalizedData = [
    { name: 'ODI Avg', [player1Name]: data[1]?.[`${player1Name}_avg`] || 0, [player2Name]: data[1]?.[`${player2Name}_avg`] || 0 },
    { name: 'Test Avg', [player1Name]: data[0]?.[`${player1Name}_avg`] || 0, [player2Name]: data[0]?.[`${player2Name}_avg`] || 0 },
    { name: 'ODI SR', [player1Name]: (data[1]?.[`${player1Name}_sr`] || 0) / 2.5, [player2Name]: (data[1]?.[`${player2Name}_sr`] || 0) / 2.5 },
    { name: 'T20I SR', [player1Name]: (data[2]?.[`${player1Name}_sr`] || 0) / 2.5, [player2Name]: (data[2]?.[`${player2Name}_sr`] || 0) / 2.5 },
    { name: 'Centuries', [player1Name]: (data[1]?.[`${player1Name}_hundreds`] || 0) + (data[0]?.[`${player1Name}_hundreds`] || 0), [player2Name]: (data[2]?.[`${player2Name}_hundreds`] || 0) + (data[0]?.[`${player2Name}_hundreds`] || 0) }
  ];

  return (
    <div className="w-full h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={normalizedData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" tick={false} />
          <Radar 
            name={player1Name} 
            dataKey={player1Name} 
            stroke="#0ea5e9" 
            fill="#0ea5e9" 
            fillOpacity={0.25} 
          />
          <Radar 
            name={player2Name} 
            dataKey={player2Name} 
            stroke="#ec4899" 
            fill="#ec4899" 
            fillOpacity={0.25} 
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
