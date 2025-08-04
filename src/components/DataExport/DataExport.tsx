import React, { useState } from 'react';
import { Download, FileText, Table, Calendar, Users, Filter } from 'lucide-react';

export const DataExport: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedData, setSelectedData] = useState('attendees');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const exportFormats = [
    { id: 'csv', name: 'CSV', icon: Table, description: 'Comma-separated values for spreadsheets' },
    { id: 'pdf', name: 'PDF', icon: FileText, description: 'Formatted document for reports' },
    { id: 'json', name: 'JSON', icon: FileText, description: 'Structured data format' },
  ];

  const dataTypes = [
    { id: 'attendees', name: 'Attendees', icon: Users, description: 'All attendee information and status' },
    { id: 'events', name: 'Events', icon: Calendar, description: 'Event details and statistics' },
    { id: 'checkins', name: 'Check-ins', icon: Users, description: 'Check-in history and timestamps' },
  ];

  const handleExport = () => {
    console.log('Exporting:', { format: selectedFormat, data: selectedData, dateRange });
    // Mock export functionality
    alert(`Exporting ${selectedData} data as ${selectedFormat.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Export</h2>
          <p className="text-gray-500 mt-1">Export your event and attendee data in various formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Type Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Data Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dataTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedData(type.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedData === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      selectedData === type.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <h4 className="font-medium text-gray-900">{type.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      selectedFormat === format.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <h4 className="font-medium text-gray-900">{format.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{format.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range Filter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Data Type:</span>
                <span className="font-medium text-gray-900 capitalize">{selectedData}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium text-gray-900 uppercase">{selectedFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Records:</span>
                <span className="font-medium text-gray-900">~1,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Size:</span>
                <span className="font-medium text-gray-900">2.4 MB</span>
              </div>
            </div>
            
            <button
              onClick={handleExport}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>

          {/* Recent Exports */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exports</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Attendees.csv</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Events.pdf</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};