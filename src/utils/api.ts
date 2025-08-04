// API utility functions for Eventbrite integration and local API calls

export interface ApiConfig {
  baseUrl: string;
  eventbriteToken?: string;
  timeout: number;
}

export const defaultConfig: ApiConfig = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api',
  timeout: 10000,
};

export class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig = defaultConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Event API methods
  async getEvents() {
    return this.request('/events');
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`);
  }

  async createEvent(event: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async updateEvent(id: string, event: any) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }

  async deleteEvent(id: string) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendee API methods
  async getAttendees(eventId?: string) {
    const endpoint = eventId ? `/attendees?eventId=${eventId}` : '/attendees';
    return this.request(endpoint);
  }

  async getAttendee(id: string) {
    return this.request(`/attendees/${id}`);
  }

  async checkInAttendee(id: string) {
    return this.request(`/attendees/${id}/checkin`, {
      method: 'POST',
    });
  }

  async updateAttendee(id: string, attendee: any) {
    return this.request(`/attendees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attendee),
    });
  }

  // Eventbrite API methods
  async syncWithEventbrite(eventId: string) {
    return this.request(`/eventbrite/sync/${eventId}`, {
      method: 'POST',
    });
  }

  async getEventbriteEvents() {
    return this.request('/eventbrite/events');
  }

  async importEventbriteEvent(eventbriteId: string) {
    return this.request('/eventbrite/import', {
      method: 'POST',
      body: JSON.stringify({ eventbriteId }),
    });
  }

  // Badge API methods
  async getBadgeTemplates(eventId?: string) {
    const endpoint = eventId ? `/badges/templates?eventId=${eventId}` : '/badges/templates';
    return this.request(endpoint);
  }

  async createBadgeTemplate(template: any) {
    return this.request('/badges/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  async generateBadges(templateId: string, attendeeIds: string[]) {
    return this.request('/badges/generate', {
      method: 'POST',
      body: JSON.stringify({ templateId, attendeeIds }),
    });
  }

  // Analytics API methods
  async getAnalytics(eventId?: string) {
    const endpoint = eventId ? `/analytics?eventId=${eventId}` : '/analytics';
    return this.request(endpoint);
  }

  // Export API methods
  async exportData(type: string, format: string, filters: any = {}) {
    return this.request('/export', {
      method: 'POST',
      body: JSON.stringify({ type, format, filters }),
    });
  }
}

export const apiClient = new ApiClient();