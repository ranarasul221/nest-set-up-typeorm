import * as nodemailer from 'nodemailer';

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOtp(email: string, otp: string) {
    await this.transporter.sendMail({
      to: email,
      subject: 'OTP',
      html: `<h2>Your OTP: ${otp}</h2>`,
    });
  }
}