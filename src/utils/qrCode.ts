import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export class QRCodeGenerator {
  static async generateQRCode(
    data: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M' as const,
      ...options,
    };

    try {
      return await QRCode.toDataURL(data, defaultOptions);
    } catch (error) {
      console.error('QR Code generation failed:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  static async generateQRCodeSVG(
    data: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M' as const,
      ...options,
    };

    try {
      return await QRCode.toString(data, { 
        type: 'svg',
        ...defaultOptions,
      });
    } catch (error) {
      console.error('QR Code SVG generation failed:', error);
      throw new Error('Failed to generate QR code SVG');
    }
  }

  static generateAttendeeQRCode(attendeeId: string, eventId: string): string {
    return `ATT-${attendeeId}-EVENT-${eventId}`;
  }

  static parseAttendeeQRCode(qrCode: string): { attendeeId: string; eventId: string } | null {
    const match = qrCode.match(/^ATT-(.+)-EVENT-(.+)$/);
    if (!match) {
      return null;
    }
    
    return {
      attendeeId: match[1],
      eventId: match[2],
    };
  }

  static async generateBadgeQRCode(
    attendeeId: string,
    eventId: string,
    options?: QRCodeOptions
  ): Promise<string> {
    const qrData = this.generateAttendeeQRCode(attendeeId, eventId);
    return this.generateQRCode(qrData, options);
  }
}