import React, { useState } from 'react';
import { Medal, TrendingUp } from 'lucide-react';

function Performance() {
  const [selectedCity, setSelectedCity] = useState('marrakech');
  const [selectedTime, setSelectedTime] = useState('month');

  const cities = [
    { id: 'casablanca', name: 'Casablanca' },
    { id: 'rabat', name: 'Rabat' },
    { id: 'marrakech', name: 'Marrakech' },
  ];

  const timeFrames = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
  ];

  // Sample data structure for each city
  const cityData = {
    casablanca: {
      revenue: 15420,
      rank: 2,
      growth: '+12%',
    },
    rabat: {
      revenue: 12840,
      rank: 3,
      growth: '+8%',
    },
    marrakech: {
      revenue: 18650,
      rank: 1,
      growth: '+15%',
    },
  };

  const selectedCityData = cityData[selectedCity as keyof typeof cityData];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Performance Rankings</h1>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="block w-full sm:w-auto rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="block w-full sm:w-auto rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            {timeFrames.map((time) => (
              <option key={time.id} value={time.id}>
                {time.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Card */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <Medal className="text-red-900" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Rank #{selectedCityData.rank} in {cities.find(c => c.id === selectedCity)?.name}
                </h2>
                <p className="text-sm text-gray-500">Based on total revenue</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900">
                {selectedCityData.revenue.toLocaleString()} MAD
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Growth</h3>
              <div className="flex items-center">
                <TrendingUp className="text-green-600 mr-2" size={24} />
                <p className="text-3xl font-bold text-gray-900">{selectedCityData.growth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Stats */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Zone Statistics</h2>
          <div className="space-y-4">
            {cities.map((city) => {
              const data = cityData[city.id as keyof typeof cityData];
              return (
                <div
                  key={city.id}
                  className={`p-4 rounded-xl ${
                    selectedCity === city.id
                      ? 'bg-red-50 ring-2 ring-red-900'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{city.name}</span>
                    <span className="text-sm text-gray-500">
                      Rank #{data.rank}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Revenue</span>
                    <span className="font-medium text-gray-900">
                      {data.revenue.toLocaleString()} MAD
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Performance;