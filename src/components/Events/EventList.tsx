import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, MapPin, Users, MoreVertical } from 'lucide-react';
import { Event } from '../../types';
import { EventForm } from './EventForm';
import { EventDetails } from './EventDetails';

interface EventListProps {
  events: Event[];
  onCreateEvent: () => void;
  onEditEvent: (event: Event) => void;
  onViewEvent: (event: Event) => void;
}

export const EventList: React.FC<EventListProps> = ({ 
  events, 
  onCreateEvent, 
  onEditEvent, 
  onViewEvent 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="text-gray-500 mt-1">Manage your events and track performance</p>
        </div>
        <button
          onClick={() => setShowEventForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-3 lg:px-6 font-medium text-gray-500 text-sm">Event</th>
                <th className="text-left py-3 px-3 lg:px-6 font-medium text-gray-500 text-sm hidden sm:table-cell">Date</th>
                <th className="text-left py-3 px-3 lg:px-6 font-medium text-gray-500 text-sm hidden md:table-cell">Venue</th>
                <th className="text-left py-3 px-3 lg:px-6 font-medium text-gray-500 text-sm">Attendees</th>
                <th className="text-left py-3 px-3 lg:px-6 font-medium text-gray-500 text-sm">Status</th>
                <th className="text-left py-3 px-3 lg:px-6 font-medium text-gray-500 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-3 lg:px-6">
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-500 truncate max-w-xs sm:hidden">{new Date(event.startDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs hidden sm:block">{event.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-3 lg:px-6 hidden sm:table-cell">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 lg:px-6 hidden md:table-cell">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 lg:px-6">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{event.checkedInCount}/{event.totalAttendees}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 lg:px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-3 lg:px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventForm(true);
                        }}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium hidden sm:inline"
                      >
                        Edit
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 sm:hidden">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first event</p>
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create Event
            </button>
          </div>
        )}
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={selectedEvent || undefined}
          onSave={(eventData) => {
            if (selectedEvent) {
              onEditEvent({ ...selectedEvent, ...eventData });
            } else {
              onCreateEvent();
            }
            setShowEventForm(false);
            setSelectedEvent(null);
          }}
          onCancel={() => {
            setShowEventForm(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <EventDetails
          event={selectedEvent}
          attendees={[]} // Pass actual attendees data
          onEdit={() => {
            setShowEventDetails(false);
            setShowEventForm(true);
          }}
          onDelete={() => {
            // Handle delete
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};