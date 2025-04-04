import React, { useState } from 'react';
import { Download, Calendar } from 'lucide-react';

function Invoices() {
  const [selectedWeek, setSelectedWeek] = useState('current');

  const invoices = [
    {
      week: 'Mar 1 - Mar 7',
      clients: 24,
      totalPurchases: 3450,
      commission: 172.50,
    },
    {
      week: 'Feb 24 - Feb 29',
      clients: 17,
      totalPurchases: 2190,
      commission: 109.50,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Weekly Invoices</h1>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="block w-full sm:w-auto rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="current">Current Week</option>
            <option value="previous">Previous Week</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {invoices.map((invoice, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-50 rounded-xl">
                  <Calendar className="text-red-900" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{invoice.week}</h3>
                  <p className="text-sm text-gray-500">{invoice.clients} clients</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Client Purchases</span>
                <span className="font-medium text-gray-900">
                  {invoice.totalPurchases.toLocaleString()} MAD
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Your Commission (5%)</span>
                <span className="font-medium text-gray-900">
                  {invoice.commission.toLocaleString()} MAD
                </span>
              </div>
            </div>

            <button className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50">
              <Download className="mr-2" size={20} />
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Invoices;