import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, // true for 465, false for 587
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_API_KEY,
            },
        });
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

        const mailOptions = {
            from: `"The Golf Press" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hi there,</p>
          <p>We received a request to reset your password for your The Golf Press account. Click the button below to set a new password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777; text-align: center;">© 2024 The Golf Press. All rights reserved.</p>
        </div>
      `,
        };

        try {
            console.log('Attempting to send email to:', email);
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully! MessageId:', info.messageId);
            return true;
        } catch (error) {
            console.error('Error sending email via nodemailer:', error);
            return false;
        }
    }
}
