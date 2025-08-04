import React from 'react';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { Event } from '../../types';

interface EventSelectionCardProps {
  event: Event;
  isSelected: boolean;
  onSelect: (eventId: string) => void;
}

export const EventSelectionCard: React.FC<EventSelectionCardProps> = ({
  event,
  isSelected,
  onSelect,
}) => {
  const checkInRate = event.totalAttendees > 0 ? (event.checkedInCount / event.totalAttendees) * 100 : 0;

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected 
        ? 'border-blue-500 bg-blue-50 shadow-md' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
      onClick={() => onSelect(event.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{event.name}</h3>
        {isSelected && (
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
        <Calendar className="w-4 h-4" />
        <span>{event.startDate.toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-lg font-bold text-blue-600">{event.totalAttendees}</div>
          <p className="text-xs text-gray-500">Attendees</p>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">{event.checkedInCount}</div>
          <p className="text-xs text-gray-500">Checked In</p>
        </div>
        <div>
          <div className="text-lg font-bold text-orange-600">{Math.round(checkInRate)}%</div>
          <p className="text-xs text-gray-500">Rate</p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${checkInRate}%` }}
        />
      </div>
    </div>
  );
};