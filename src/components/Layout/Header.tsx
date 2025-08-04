import React from 'react';
import { Search, User, LogOut, Wifi, WifiOff, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';
import { NotificationCenter } from '../Notifications/NotificationCenter';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { isConnected } = useWebSocket();
  
  const mockNotifications = [
    {
      id: '1',
      type: 'success' as const,
      title: 'Event Published',
      message: 'Tech Conference 2025 has been published successfully',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'New Check-in',
      message: 'John Doe checked in to Marketing Summit',
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events, attendees..."
              className="pl-10 pr-4 py-2 w-48 sm:w-64 lg:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Live</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-500">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Offline</span>
              </div>
            )}
          </div>
          
          <NotificationCenter
            notifications={mockNotifications}
            onMarkAsRead={(id) => console.log('Mark as read:', id)}
            onMarkAllAsRead={() => console.log('Mark all as read')}
            onDismiss={(id) => console.log('Dismiss:', id)}
          />
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};