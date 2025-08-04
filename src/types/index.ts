export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'organizer' | 'staff' | 'scanner';
  organizationId?: string;
}

export interface Event {
  id: string;
  eventbriteId?: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  status: 'draft' | 'published' | 'live' | 'ended';
  totalAttendees: number;
  checkedInCount: number;
  vipCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendee {
  id: string;
  eventId: string;
  eventbriteId?: string;
  firstName: string;
  lastName: string;
  email: string;
  ticketType: string;
  isVip: boolean;
  isCheckedIn: boolean;
  checkedInAt?: Date;
  qrCode: string;
  badgeGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BadgeTemplate {
  id: string;
  name: string;
  eventId: string;
  isVipTemplate: boolean;
  backgroundColor: string;
  textColor: string;
  logoUrl?: string;
  fields: BadgeField[];
  dimensions: {
    width: number;
    height: number;
  };
}

export interface BadgeField {
  id: string;
  type: 'text' | 'qr' | 'logo' | 'image';
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  style: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface EventbriteConfig {
  accessToken: string;
  organizationId: string;
  webhookEndpoint: string;
}

export interface CheckInSession {
  id: string;
  eventId: string;
  staffMemberId: string;
  isActive: boolean;
  checkInsCount: number;
  startedAt: Date;
  endedAt?: Date;
}