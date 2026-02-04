
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface VisualizationProps {
  totalDonations: number;
  totalExpenses: number;
}

const Visualization: React.FC<VisualizationProps> = ({ totalDonations, totalExpenses }) => {
  const data = [
    { name: 'Donations', value: totalDonations, color: '#1a1a1a' },
    { name: 'Expenses', value: totalExpenses, color: '#71717a' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-xl border border-gray-100 rounded-lg">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {payload[0].payload.name}
          </p>
          <p className="text-lg font-bold text-gray-900">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md h-[400px]">
      <h3 className="text-xl font-bold mb-8 text-gray-800 border-l-4 border-gray-900 pl-4">Financial Overview</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Visualization;
