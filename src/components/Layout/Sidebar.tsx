import React from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  QrCode, 
  Badge, 
  Settings, 
  BarChart3,
  Download,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const getMenuItemsForRole = (role: string) => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'organizer', 'staff'] },
    { id: 'events', label: 'Events', icon: Calendar, roles: ['admin', 'organizer'] },
    { id: 'attendees', label: 'Attendees', icon: Users, roles: ['admin', 'organizer', 'staff'] },
    { id: 'checkin', label: 'Check-in', icon: QrCode, roles: ['admin', 'organizer', 'staff', 'scanner'] },
    { id: 'badges', label: 'Badge Designer', icon: Badge, roles: ['admin', 'organizer'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'organizer'] },
    { id: 'exports', label: 'Data Export', icon: Download, roles: ['admin', 'organizer'] },
    { id: 'integrations', label: 'Integrations', icon: Zap, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'organizer', 'staff'] },
  ];

  return baseItems.filter(item => item.roles.includes(role));
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onToggle }) => {
  const { user } = useAuth();
  const menuItems = getMenuItemsForRole(user?.role || 'staff');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 h-full
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EventManager</h1>
            <p className="text-sm text-gray-500">Pro Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
    </>
  );
};