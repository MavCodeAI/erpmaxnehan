
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { MOCK_CHART_DATA } from '../../constants';
import { useTheme } from '../../hooks/useTheme';

const OverviewChart: React.FC = () => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';

  return (
    <Card className="col-span-1 lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Financial Overview</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
            <XAxis dataKey="name" stroke={tickColor} />
            <YAxis stroke={tickColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
              }}
            />
            <Legend />
            <Bar dataKey="Sales" fill="#3b82f6" />
            <Bar dataKey="Purchases" fill="#f97316" />
            <Bar dataKey="Income" fill="#10b981" />
            <Bar dataKey="Expenses" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default OverviewChart;
