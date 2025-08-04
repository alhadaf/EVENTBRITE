import React, { useState } from 'react';
import { Calendar, Search, UserPlus } from 'lucide-react';
import { Event, Attendee } from '../../types';
import { EventSelectionCard } from './EventSelectionCard';
import { QRScanner } from './QRScanner';
import { ScannerDashboard } from '../Scanner/ScannerDashboard';

interface IntegratedCheckInProps {
  events: Event[];
  attendees: Attendee[];
  onCheckIn: (attendeeId: string, eventId: string) => void;
  onAddWalkIn: (attendee: Partial<Attendee>, eventId: string) => void;
  onPrintLabel: (attendeeId: string) => void;
  onBack?: () => void;
}

export const IntegratedCheckIn: React.FC<IntegratedCheckInProps> = ({
  events,
  attendees,
  onCheckIn,
  onAddWalkIn,
  onPrintLabel,
  onBack,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scanner' | 'walkin'>('scanner');
  const [scannerActive, setScannerActive] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalScans: 0,
    successfulScans: 0,
    duplicateScans: 0,
    sessionDuration: '0h 0m',
  });

  // Filter attendees by selected event
  const filteredAttendees = selectedEventId
    ? attendees.filter(attendee => attendee.eventId === selectedEventId)
    : [];
    
  // Get selected event details
  const selectedEvent = selectedEventId
    ? events.find(event => event.id === selectedEventId)
    : null;

  const handleScan = (qrCode: string) => {
    if (!selectedEventId) return;
    
    console.log('Scanned QR code:', qrCode, 'for event:', selectedEventId);
    
    // Find attendee by QR code
    const attendee = attendees.find(a => a.qrCode === qrCode && a.eventId === selectedEventId);
    
    if (attendee) {
      onCheckIn(attendee.id, selectedEventId);
      setSessionStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + 1,
        successfulScans: prev.successfulScans + 1,
      }));
    } else {
      setSessionStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + 1,
        duplicateScans: prev.duplicateScans + 1,
      }));
    }
  };

  const handleAddWalkIn = (attendee: Partial<Attendee>) => {
    if (!selectedEventId) return;
    onAddWalkIn({ ...attendee, eventId: selectedEventId }, selectedEventId);
  };

  const handleCheckIn = (attendeeId: string) => {
    if (!selectedEventId) return;
    onCheckIn(attendeeId, selectedEventId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedEventId 
              ? `Check-in: ${selectedEvent?.name}` 
              : "Check-in"}
          </h2>
          <p className="text-gray-500 mt-1">
            {selectedEventId
              ? `Manage check-ins for this event`
              : "Select an event, then scan or add walk-ins"}
          </p>
        </div>
        {selectedEventId && (
          <button
            onClick={() => setSelectedEventId(null)}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Events
          </button>
        )}
      </div>

      {/* Event Selection - Only shown when no event is selected */}
      {!selectedEventId && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Event</h3>
          
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events available</h3>
              <p className="text-gray-500">Create an event to get started with check-ins</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <EventSelectionCard
                  key={event.id}
                  event={event}
                  isSelected={selectedEventId === event.id}
                  onSelect={setSelectedEventId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Check-in Tools (only shown when an event is selected) */}
      {selectedEventId && (
        <div>
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'scanner' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('scanner')}
            >
              QR Scanner
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'walkin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('walkin')}
            >
              Walk-in Registration
            </button>
          </div>

          {activeTab === 'scanner' ? (
            <QRScanner
              onScan={handleScan}
              isActive={scannerActive}
              onToggleScanner={() => setScannerActive(!scannerActive)}
              sessionStats={sessionStats}
            />
          ) : (
            <ScannerDashboard
              attendees={filteredAttendees}
              onCheckIn={handleCheckIn}
              onAddWalkIn={handleAddWalkIn}
              onPrintLabel={onPrintLabel}
              eventId={selectedEventId || undefined}
              eventName={selectedEvent?.name}
            />
          )}
        </div>
      )}
    </div>
  );
};