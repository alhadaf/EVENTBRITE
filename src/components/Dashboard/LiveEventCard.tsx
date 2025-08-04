import React from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';
import { Event } from '../../types';

interface LiveEventCardProps {
  event: Event;
  onViewDetails: (eventId: string) => void;
}

export const LiveEventCard: React.FC<LiveEventCardProps> = ({ event, onViewDetails }) => {
  const checkInRate = event.totalAttendees > 0 ? (event.checkedInCount / event.totalAttendees) * 100 : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{event.startDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          event.status === 'live' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {event.status.toUpperCase()}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gray-900">
            <Users className="w-5 h-5 text-gray-400" />
            <span>{event.totalAttendees}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Total Attendees</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-green-600">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>{event.checkedInCount}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Checked In</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-orange-600">
            <Clock className="w-5 h-5 text-orange-400" />
            <span>{Math.round(checkInRate)}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Check-in Rate</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${checkInRate}%` }}
        />
      </div>
      
      <button
        onClick={() => onViewDetails(event.id)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        View Details
      </button>
    </div>
  );
};