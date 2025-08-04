import React, { useState } from 'react';
import { Search, Filter, Download, UserCheck, Star, Mail, QrCode, MoreVertical } from 'lucide-react';
import { Attendee } from '../../types';

interface AttendeeListProps {
  attendees: Attendee[];
  onToggleVip: (attendeeId: string) => void;
  onCheckIn: (attendeeId: string) => void;
  onSendEmail: (attendeeId: string) => void;
  onGenerateBadge: (attendeeId: string) => void;
}

export const AttendeeList: React.FC<AttendeeListProps> = ({
  attendees,
  onToggleVip,
  onCheckIn,
  onSendEmail,
  onGenerateBadge,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = 
      attendee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'checked-in' && attendee.isCheckedIn) ||
      (filterStatus === 'not-checked-in' && !attendee.isCheckedIn) ||
      (filterStatus === 'vip' && attendee.isVip);
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(filteredAttendees.map(a => a.id));
    }
  };

  const handleSelectAttendee = (attendeeId: string) => {
    setSelectedAttendees(prev => 
      prev.includes(attendeeId) 
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const bulkActions = [
    { label: 'Mark as VIP', action: () => selectedAttendees.forEach(onToggleVip) },
    { label: 'Send Email', action: () => selectedAttendees.forEach(onSendEmail) },
    { label: 'Generate Badges', action: () => selectedAttendees.forEach(onGenerateBadge) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendees</h2>
          <p className="text-gray-500 mt-1">Manage event attendees and their status</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search attendees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Attendees</option>
                  <option value="checked-in">Checked In</option>
                  <option value="not-checked-in">Not Checked In</option>
                  <option value="vip">VIP Only</option>
                </select>
              </div>
            </div>
            
            {selectedAttendees.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedAttendees.length} selected</span>
                <select
                  onChange={(e) => {
                    const action = bulkActions.find(a => a.label === e.target.value);
                    if (action) {
                      action.action();
                      setSelectedAttendees([]);
                      e.target.value = '';
                    }
                  }}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Bulk Actions</option>
                  {bulkActions.map(action => (
                    <option key={action.label} value={action.label}>{action.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Total: {attendees.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Checked In: {attendees.filter(a => a.isCheckedIn).length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>VIP: {attendees.filter(a => a.isVip).length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Badges Generated: {attendees.filter(a => a.badgeGenerated).length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">Attendee</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">Ticket Type</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">Check-in</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.includes(attendee.id)}
                      onChange={() => handleSelectAttendee(attendee.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {attendee.firstName.charAt(0)}{attendee.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                          <span>{attendee.firstName} {attendee.lastName}</span>
                          {attendee.isVip && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        </h4>
                        <p className="text-sm text-gray-500">{attendee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {attendee.ticketType}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {attendee.isCheckedIn ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <UserCheck className="w-4 h-4" />
                          <span className="text-sm font-medium">Checked In</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-gray-400">
                          <UserCheck className="w-4 h-4" />
                          <span className="text-sm">Not Checked In</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {attendee.checkedInAt ? (
                      <div className="text-sm text-gray-600">
                        {new Date(attendee.checkedInAt).toLocaleString()}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onToggleVip(attendee.id)}
                        className={`p-1 rounded hover:bg-gray-100 ${attendee.isVip ? 'text-yellow-500' : 'text-gray-400'}`}
                        title={attendee.isVip ? 'Remove VIP' : 'Make VIP'}
                      >
                        <Star className={`w-4 h-4 ${attendee.isVip ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => onSendEmail(attendee.id)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-600"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onGenerateBadge(attendee.id)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-green-600"
                        title="Generate Badge"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAttendees.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};