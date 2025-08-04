import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';
import { LoginForm } from './components/Auth/LoginForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { StatsCard } from './components/Dashboard/StatsCard';
import { LiveEventCard } from './components/Dashboard/LiveEventCard';
import { EventList } from './components/Events/EventList';
import { AttendeeList } from './components/Attendees/AttendeeList';
import { QRScanner } from './components/CheckIn/QRScanner';
import { IntegratedCheckIn } from './components/CheckIn/IntegratedCheckIn';
import { BadgeDesigner } from './components/Badges/BadgeDesigner';
import { Analytics } from './components/Analytics/Analytics';
import { DataExport } from './components/DataExport/DataExport';
import { Integrations } from './components/Integrations/Integrations';
import { Settings } from './components/Settings/Settings';
import { ScannerDashboard } from './components/Scanner/ScannerDashboard';
import { Calendar, Users, CheckCircle, Star } from 'lucide-react';
import { Event, Attendee, BadgeTemplate } from './types';

const queryClient = new QueryClient();

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    eventbriteId: 'eb-123',
    name: 'Tech Conference 2025',
    description: 'Annual technology conference featuring the latest innovations',
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-03-16'),
    venue: 'Convention Center',
    status: 'live',
    totalAttendees: 450,
    checkedInCount: 324,
    vipCount: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    eventbriteId: 'eb-124',
    name: 'Marketing Summit',
    description: 'Digital marketing strategies and trends',
    startDate: new Date('2025-04-20'),
    endDate: new Date('2025-04-20'),
    venue: 'Business Center',
    status: 'published',
    totalAttendees: 200,
    checkedInCount: 0,
    vipCount: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockAttendees: Attendee[] = [
  {
    id: '1',
    eventId: '1',
    eventbriteId: 'eb-att-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    ticketType: 'VIP',
    isVip: true,
    isCheckedIn: true,
    checkedInAt: new Date(),
    qrCode: 'ATT-001-EVENT-123',
    badgeGenerated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    eventId: '1',
    eventbriteId: 'eb-att-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    ticketType: 'Regular',
    isVip: false,
    isCheckedIn: false,
    qrCode: 'ATT-002-EVENT-123',
    badgeGenerated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockBadgeTemplates: BadgeTemplate[] = [
  {
    id: '1',
    name: 'Standard Template',
    eventId: '1',
    isVipTemplate: false,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    dimensions: { width: 400, height: 600 },
    fields: [
      {
        id: '1',
        type: 'text',
        content: '{firstName} {lastName}',
        position: { x: 50, y: 100 },
        size: { width: 300, height: 40 },
        style: { fontSize: 24, fontWeight: 'bold', color: '#000000' },
      },
      {
        id: '2',
        type: 'qr',
        content: 'QR-CODE-DATA',
        position: { x: 150, y: 200 },
        size: { width: 100, height: 100 },
        style: {},
      },
    ],
  },
];

function Dashboard() {
  const { on, emit } = useWebSocket();
  const [scannerActive, setScannerActive] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalScans: 127,
    successfulScans: 115,
    duplicateScans: 12,
    sessionDuration: '2h 45m',
  });

  const handleScan = (qrCode: string) => {
    console.log('Scanned QR code:', qrCode);
    emit('checkin', { qrCode, timestamp: new Date() });
    setSessionStats(prev => ({
      ...prev,
      totalScans: prev.totalScans + 1,
      successfulScans: prev.successfulScans + 1,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your events.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value={mockEvents.length}
          change={12}
          changeLabel="vs last month"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Total Attendees"
          value={mockEvents.reduce((acc, event) => acc + event.totalAttendees, 0)}
          change={8}
          changeLabel="vs last month"
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Check-ins Today"
          value={mockEvents.reduce((acc, event) => acc + event.checkedInCount, 0)}
          change={15}
          changeLabel="vs yesterday"
          icon={CheckCircle}  
          color="orange"
        />
        <StatsCard
          title="VIP Attendees"
          value={mockEvents.reduce((acc, event) => acc + event.vipCount, 0)}
          change={5}
          changeLabel="vs last month"
          icon={Star}
          color="purple"
        />
      </div>

      {/* Live Events */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.filter(event => event.status === 'live').map(event => (
            <LiveEventCard
              key={event.id}
              event={event}
              onViewDetails={(eventId) => console.log('View event:', eventId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  // Scanner role should only see check-in functionality
  if (user?.role === 'scanner') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Check-in</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
          </div>
        </div>
        <main className="p-6">
          <IntegratedCheckIn
            events={mockEvents}
            attendees={mockAttendees}
            onCheckIn={(attendeeId, eventId) => console.log('Check in:', attendeeId, 'for event:', eventId)}
            onAddWalkIn={(attendee, eventId) => console.log('Add walk-in:', attendee, 'for event:', eventId)}
            onPrintLabel={(attendeeId) => console.log('Print label:', attendeeId)}
            onBack={() => console.log('Back to event selection')}
          />
        </main>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return (
          <EventList
            events={mockEvents}
            onCreateEvent={() => {
              const newEvent: Event = {
                id: Date.now().toString(),
                name: 'New Event',
                description: '',
                startDate: new Date(),
                endDate: new Date(),
                venue: '',
                status: 'draft',
                totalAttendees: 0,
                checkedInCount: 0,
                vipCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              console.log('Create event:', newEvent);
            }}
            onEditEvent={(event) => console.log('Edit event:', event)}
            onViewEvent={(event) => console.log('View event:', event)}
          />
        );
      case 'attendees':
        return (
          <AttendeeList
            attendees={mockAttendees}
            onToggleVip={(id) => console.log('Toggle VIP:', id)}
            onCheckIn={(id) => console.log('Check in:', id)}
            onSendEmail={(id) => console.log('Send email:', id)}
            onGenerateBadge={(id) => console.log('Generate badge:', id)}
          />
        );

      case 'checkin':
        return (
          <IntegratedCheckIn
            events={mockEvents}
            attendees={mockAttendees}
            onCheckIn={(attendeeId, eventId) => console.log('Check in:', attendeeId, 'for event:', eventId)}
            onAddWalkIn={(attendee, eventId) => console.log('Add walk-in:', attendee, 'for event:', eventId)}
            onPrintLabel={(attendeeId) => console.log('Print label:', attendeeId)}
            onBack={() => console.log('Back to event selection')}
          />
        );
      case 'badges':
        return (
          <BadgeDesigner
            templates={mockBadgeTemplates}
            onSaveTemplate={(template) => console.log('Save template:', template)}
            onGenerateBadges={(templateId) => console.log('Generate badges:', templateId)}
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'exports':
        return <DataExport />;
      case 'integrations':
        return <Integrations />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            <p className="text-gray-500">This section is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Force re-render when authentication state changes
  React.useEffect(() => {
    // This effect will run whenever isAuthenticated changes
    console.log('Authentication state changed:', isAuthenticated);
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthenticated ? <AppContent /> : <LoginForm />}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;