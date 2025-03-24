import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: false, // Use true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"No Reply" <${process.env.SENDER_EMAIL}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string) {
    const html = `<h1>Welcome, ${userName}!</h1><p>Thank you for registering with us.</p>`;
    return this.sendEmail(userEmail, 'Welcome to Our Service', html);
  }

  async sendPasswordResetEmail(userEmail: string, resetToken: string) {
    const resetLink = `https://yourwebsite.com/reset-password?token=${resetToken}`;
    const html = `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;
    return this.sendEmail(userEmail, 'Password Reset Request', html);
  }
}
