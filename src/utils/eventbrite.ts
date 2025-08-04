// Eventbrite API integration utilities

export interface EventbriteConfig {
  accessToken: string;
  organizationId: string;
  baseUrl: string;
}

export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
  };
  description: {
    text: string;
  };
  start: {
    timezone: string;
    local: string;
    utc: string;
  };
  end: {
    timezone: string;
    local: string;
    utc: string;
  };
  venue: {
    name: string;
    address: {
      address_1: string;
      city: string;
      region: string;
      country: string;
    };
  };
  status: string;
  capacity: number;
}

export interface EventbriteAttendee {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
  ticket_class_name: string;
  checked_in: boolean;
  cancelled: boolean;
  refunded: boolean;
  order_id: string;
  barcode: string;
}

export class EventbriteClient {
  private config: EventbriteConfig;

  constructor(config: EventbriteConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Eventbrite API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get organization events
  async getOrganizationEvents(): Promise<{ events: EventbriteEvent[] }> {
    return this.request(`/organizations/${this.config.organizationId}/events/`);
  }

  // Get specific event
  async getEvent(eventId: string): Promise<EventbriteEvent> {
    return this.request(`/events/${eventId}/`);
  }

  // Get event attendees
  async getEventAttendees(eventId: string): Promise<{ attendees: EventbriteAttendee[] }> {
    return this.request(`/events/${eventId}/attendees/`);
  }

  // Check in attendee
  async checkInAttendee(eventId: string, attendeeId: string): Promise<any> {
    return this.request(`/events/${eventId}/attendees/${attendeeId}/`, {
      method: 'POST',
      body: JSON.stringify({ checked_in: true }),
    });
  }

  // Get attendee by barcode
  async getAttendeeByBarcode(eventId: string, barcode: string): Promise<EventbriteAttendee> {
    const response = await this.request<{ attendees: EventbriteAttendee[] }>(
      `/events/${eventId}/attendees/?barcode=${barcode}`
    );
    
    if (response.attendees.length === 0) {
      throw new Error('Attendee not found');
    }
    
    return response.attendees[0];
  }

  // Create webhook
  async createWebhook(eventId: string, endpoint: string, actions: string[]): Promise<any> {
    return this.request(`/webhooks/`, {
      method: 'POST',
      body: JSON.stringify({
        endpoint_url: endpoint,
        actions: actions.join(','),
        event_id: eventId,
      }),
    });
  }

  // Validate webhook signature
  static validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }
}

// Helper functions for data transformation
export const transformEventbriteEvent = (ebEvent: EventbriteEvent) => ({
  eventbriteId: ebEvent.id,
  name: ebEvent.name.text,
  description: ebEvent.description.text,
  startDate: new Date(ebEvent.start.utc),
  endDate: new Date(ebEvent.end.utc),
  venue: ebEvent.venue?.name || 'TBD',
  status: ebEvent.status.toLowerCase(),
  totalAttendees: ebEvent.capacity || 0,
});

export const transformEventbriteAttendee = (ebAttendee: EventbriteAttendee) => ({
  eventbriteId: ebAttendee.id,
  firstName: ebAttendee.profile.first_name,
  lastName: ebAttendee.profile.last_name,
  email: ebAttendee.profile.email,
  ticketType: ebAttendee.ticket_class_name,
  isCheckedIn: ebAttendee.checked_in,
  qrCode: ebAttendee.barcode,
  isVip: ebAttendee.ticket_class_name.toLowerCase().includes('vip'),
});