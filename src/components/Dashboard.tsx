import React, { useState, useEffect } from 'react';
import { Users, Download, Coins, TrendingUp } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
  LabelList,
} from 'recharts';

function Dashboard() {
  type TimeFilter = 'day' | 'week' | 'month';
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [metrics, setMetrics] = useState({ total: 0, loggedIn: 0, totalRevenue: 0 });

  const transactionData = {
    day: [
      { date: '9:00', amount: 1200 },
      { date: '12:00', amount: 2100 },
      { date: '15:00', amount: 1800 },
      { date: '18:00', amount: 2400 },
      { date: '21:00', amount: 1600 },
    ],
    week: [
      { date: 'Mon', amount: 5200 },
      { date: 'Tue', amount: 7200 },
      { date: 'Wed', amount: 11000 },
      { date: 'Thu', amount: 12000 },
      { date: 'Fri', amount: 9500 },
      { date: 'Sat', amount: 14000 },
      { date: 'Sun', amount: 15500 },
    ],
    month: [
      { date: 'Week 1', amount: 45000 },
      { date: 'Week 2', amount: 52000 },
      { date: 'Week 3', amount: 49000 },
      { date: 'Week 4', amount: 58000 },
    ],
  };

  const serviceData = [
    { name: 'eSIM', value: 2100, percentage: 28, color: '#991B1B' },
    { name: 'Pickups', value: 1800, percentage: 24, color: '#F87171' },
    { name: 'Tickets', value: 2900, percentage: 39, color: '#FCA5A5' },
    { name: 'Exchange', value: 620, percentage: 9, color: '#FEE2E2' },
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axiosInstance.get('/agencies/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, highlight = false }: any) => (
    <div className={`
      relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm
      ${highlight ? 'ring-2 ring-red-900 bg-gradient-to-br from-red-50 to-white' : ''}
    `}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`
          p-3 rounded-xl
          ${highlight ? 'bg-red-100' : 'bg-red-50'}
        `}>
          <Icon className="text-red-900" size={24} />
        </div>
      </div>
      {highlight && (
        <div className="absolute -right-6 -bottom-6 w-24 h-24 opacity-10">
          <Icon className="text-red-900 w-full h-full" />
        </div>
      )}
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-red-900">
            {payload[0].value.toLocaleString()} MAD
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-sm font-medium"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={serviceData[index].color}
          fill="none"
        />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          className="text-sm font-medium"
        >
          {`${serviceData[index].name}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey + 20}
          textAnchor={textAnchor}
          fill="#666"
          className="text-sm"
        >
          {`${serviceData[index].value.toLocaleString()} MAD`}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Users Added" 
          value={metrics.total.toString()} 
          subtitle="tourists" 
        />
        <StatCard 
          icon={Download} 
          title="App Downloads" 
          value={metrics.loggedIn.toString()} 
          subtitle="downloads" 
        />
        <StatCard 
          icon={Coins} 
          title="Total Revenue" 
          value={metrics.totalRevenue.toLocaleString() + " MAD"} 
          subtitle="from all services" 
        />
        <StatCard 
          icon={Coins} 
          title="Agency Revenue" 
          value={(metrics.totalRevenue * 0.05).toLocaleString() + " MAD"} 
          subtitle="5% commission" 
          highlight={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transactions Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Daily Transactions</h2>
            <div className="flex space-x-2">
              {['day', 'week', 'month'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter as TimeFilter)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    timeFilter === filter
                      ? 'bg-red-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={transactionData[timeFilter]}
                margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(value) => `${value.toLocaleString()} MAD`}
                  tickMargin={10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#991B1B"
                  strokeWidth={2}
                  dot={{ fill: '#991B1B', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#991B1B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Purchase Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 50, bottom: 0, left: 50 }}>
                <Pie
                  data={serviceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={100}
                  labelLine={true}
                  label={renderCustomizedLabel}
                >
                  {serviceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;