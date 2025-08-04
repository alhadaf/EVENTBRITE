import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Attendee, BadgeTemplate } from '../types';
import { QRCodeGenerator } from './qrCode';

export interface BadgeData {
  attendee: Attendee;
  template: BadgeTemplate;
  qrCodeDataUrl?: string;
}

export class PDFGenerator {
  static async generateBadgePDF(badges: BadgeData[]): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const badgesPerPage = 6; // 2 columns x 3 rows
    const badgeWidth = 85; // mm
    const badgeHeight = 54; // mm (credit card size)
    const margin = 10;

    for (let i = 0; i < badges.length; i++) {
      const badge = badges[i];
      const pageIndex = Math.floor(i / badgesPerPage);
      const badgeIndex = i % badgesPerPage;

      // Add new page if needed
      if (i > 0 && badgeIndex === 0) {
        pdf.addPage();
      }

      // Calculate position
      const col = badgeIndex % 2;
      const row = Math.floor(badgeIndex / 2);
      const x = margin + col * (badgeWidth + margin);
      const y = margin + row * (badgeHeight + margin);

      await this.drawBadge(pdf, badge, x, y, badgeWidth, badgeHeight);
    }

    return pdf.output('blob');
  }

  private static async drawBadge(
    pdf: jsPDF,
    badge: BadgeData,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    const { attendee, template } = badge;

    // Draw border
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(x, y, width, height);

    // Set background color
    if (template.backgroundColor !== '#ffffff') {
      pdf.setFillColor(template.backgroundColor);
      pdf.rect(x, y, width, height, 'F');
    }

    // Generate QR code if not provided
    let qrCodeDataUrl = badge.qrCodeDataUrl;
    if (!qrCodeDataUrl) {
      qrCodeDataUrl = await QRCodeGenerator.generateBadgeQRCode(
        attendee.id,
        attendee.eventId,
        { width: 100 }
      );
    }

    // Draw fields
    for (const field of template.fields) {
      const fieldX = x + (field.position.x * width) / template.dimensions.width;
      const fieldY = y + (field.position.y * height) / template.dimensions.height;
      const fieldWidth = (field.size.width * width) / template.dimensions.width;
      const fieldHeight = (field.size.height * height) / template.dimensions.height;

      switch (field.type) {
        case 'text':
          await this.drawTextField(pdf, field, attendee, fieldX, fieldY, fieldWidth, fieldHeight);
          break;
        case 'qr':
          await this.drawQRField(pdf, qrCodeDataUrl, fieldX, fieldY, fieldWidth, fieldHeight);
          break;
      }
    }
  }

  private static async drawTextField(
    pdf: jsPDF,
    field: any,
    attendee: Attendee,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    // Replace placeholders
    let text = field.content
      .replace('{firstName}', attendee.firstName)
      .replace('{lastName}', attendee.lastName)
      .replace('{email}', attendee.email)
      .replace('{ticketType}', attendee.ticketType);

    // Set font properties
    pdf.setFontSize(field.style.fontSize || 12);
    pdf.setTextColor(field.style.color || '#000000');

    // Draw text
    pdf.text(text, x, y + height / 2, {
      maxWidth: width,
      align: 'center',
    });
  }

  private static async drawQRField(
    pdf: jsPDF,
    qrCodeDataUrl: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    try {
      pdf.addImage(qrCodeDataUrl, 'PNG', x, y, width, height);
    } catch (error) {
      console.error('Failed to add QR code to PDF:', error);
    }
  }

  static async generateAttendeeListPDF(attendees: Attendee[], eventName: string): Promise<Blob> {
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(20);
    pdf.text(`Attendee List - ${eventName}`, 20, 20);
    
    // Headers
    pdf.setFontSize(12);
    pdf.text('Name', 20, 40);
    pdf.text('Email', 80, 40);
    pdf.text('Ticket Type', 140, 40);
    pdf.text('Status', 180, 40);
    
    // Draw line under headers
    pdf.line(20, 42, 200, 42);
    
    let yPosition = 50;
    
    attendees.forEach((attendee, index) => {
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(10);
      pdf.text(`${attendee.firstName} ${attendee.lastName}`, 20, yPosition);
      pdf.text(attendee.email, 80, yPosition);
      pdf.text(attendee.ticketType, 140, yPosition);
      pdf.text(attendee.isCheckedIn ? 'Checked In' : 'Not Checked In', 180, yPosition);
      
      yPosition += 8;
    });
    
    return pdf.output('blob');
  }

  static async generateEventReportPDF(eventData: any): Promise<Blob> {
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(20);
    pdf.text(`Event Report - ${eventData.name}`, 20, 20);
    
    // Event details
    pdf.setFontSize(12);
    pdf.text(`Date: ${eventData.startDate.toLocaleDateString()}`, 20, 40);
    pdf.text(`Venue: ${eventData.venue}`, 20, 50);
    pdf.text(`Total Attendees: ${eventData.totalAttendees}`, 20, 60);
    pdf.text(`Checked In: ${eventData.checkedInCount}`, 20, 70);
    pdf.text(`Check-in Rate: ${Math.round((eventData.checkedInCount / eventData.totalAttendees) * 100)}%`, 20, 80);
    
    return pdf.output('blob');
  }
}