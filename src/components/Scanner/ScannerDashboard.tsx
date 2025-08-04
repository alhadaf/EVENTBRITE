import React, { useState } from 'react';
import { Search, UserPlus, QrCode, CheckCircle, XCircle, User, Clock, Printer } from 'lucide-react';
import { Attendee } from '../../types';

interface ScannerDashboardProps {
  attendees: Attendee[];
  onCheckIn: (attendeeId: string) => void;
  onAddWalkIn: (attendee: Partial<Attendee>) => void;
  onPrintLabel: (attendeeId: string) => void;
  eventId?: string;
  eventName?: string;
}

export const ScannerDashboard: React.FC<ScannerDashboardProps> = ({
  attendees,
  onCheckIn,
  onAddWalkIn,
  onPrintLabel,
  eventId,
  eventName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddWalkIn, setShowAddWalkIn] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    ticketType: 'Walk-in',
  });
  const [lastAction, setLastAction] = useState<{
    type: 'checkin' | 'walkin' | 'print';
    attendee: string;
    timestamp: Date;
  } | null>(null);

  const filteredAttendees = attendees.filter(attendee =>
    attendee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = (attendeeId: string) => {
    onCheckIn(attendeeId);
    const attendee = attendees.find(a => a.id === attendeeId);
    setLastAction({
      type: 'checkin',
      attendee: `${attendee?.firstName} ${attendee?.lastName}`,
      timestamp: new Date(),
    });
  };

  const handleAddWalkIn = () => {
    if (walkInForm.firstName && walkInForm.lastName) {
      onAddWalkIn({...walkInForm,
        isVip: false,
        isCheckedIn: true,
        checkedInAt: new Date(),
        qrCode: `WALKIN-${Date.now()}`,
        badgeGenerated: false,
        eventId: eventId,
      });
      setLastAction({
        type: 'walkin',
        attendee: `${walkInForm.firstName} ${walkInForm.lastName}`,
        timestamp: new Date(),
      });
      setWalkInForm({ firstName: '', lastName: '', email: '', ticketType: 'Walk-in' });
      setShowAddWalkIn(false);
    }
  };

  const handlePrintLabel = (attendeeId: string) => {
    onPrintLabel(attendeeId);
    const attendee = attendees.find(a => a.id === attendeeId);
    setLastAction({
      type: 'print',
      attendee: `${attendee?.firstName} ${attendee?.lastName}`,
      timestamp: new Date(),
    });
  };

  const sessionStats = {
    totalScanned: attendees.filter(a => a.isCheckedIn).length,
    walkIns: attendees.filter(a => a.ticketType === 'Walk-in').length,
    sessionTime: '2h 15m',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Scanner Dashboard</h2>
          <p className="text-gray-500 mt-1">
            {eventName 
              ? `Check-in attendees and manage walk-ins for ${eventName}` 
              : "Check-in attendees and manage walk-ins"}
          </p>
        </div>
        <button
          onClick={() => setShowAddWalkIn(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Walk-in</span>
        </button>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Checked In</p>
              <p className="text-xl font-bold text-gray-900">{sessionStats.totalScanned}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Walk-ins</p>
              <p className="text-xl font-bold text-gray-900">{sessionStats.walkIns}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Session Time</p>
              <p className="text-xl font-bold text-gray-900">{sessionStats.sessionTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Action */}
      {lastAction && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                {lastAction.type === 'checkin' && 'Successfully checked in'}
                {lastAction.type === 'walkin' && 'Walk-in attendee added'}
                {lastAction.type === 'print' && 'Label printed for'}
                : {lastAction.attendee}
              </p>
              <p className="text-sm text-green-600">
                {lastAction.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search and Check-in */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Attendee Search</h3>
            <QrCode className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="relative mb-6">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAttendees.map((attendee) => (
              <div
                key={attendee.id}
                className={`p-4 border rounded-lg transition-colors ${
                  attendee.isCheckedIn
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {attendee.firstName} {attendee.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">{attendee.email}</p>
                      <p className="text-xs text-gray-400">{attendee.ticketType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {attendee.isCheckedIn ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">Checked In</span>
                        <button
                          onClick={() => handlePrintLabel(attendee.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          title="Print Label"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(attendee.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAttendees.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees found</h3>
              <p className="text-gray-500 mb-4">No attendees match your search criteria</p>
              <button
                onClick={() => setShowAddWalkIn(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add as Walk-in
              </button>
            </div>
          )}
        </div>

        {/* Walk-in Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          {showAddWalkIn ? (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Add Walk-in Attendee</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={walkInForm.firstName}
                  onChange={(e) => setWalkInForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={walkInForm.lastName}
                  onChange={(e) => setWalkInForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={walkInForm.email}
                  onChange={(e) => setWalkInForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddWalkIn}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add & Check In
                </button>
                <button
                  onClick={() => setShowAddWalkIn(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => setShowAddWalkIn(true)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Walk-in</span>
              </button>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Recent Check-ins</h4>
                <div className="space-y-2">
                  {attendees
                    .filter(a => a.isCheckedIn)
                    .slice(0, 3)
                    .map(attendee => (
                      <div key={attendee.id} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-900">{attendee.firstName} {attendee.lastName}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};