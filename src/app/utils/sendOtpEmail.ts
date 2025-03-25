import status from 'http-status';
import nodemailer from 'nodemailer';
import config from '../config';
import AppError from './AppError';

const sendOtpEmail = async (email: string, otp: string, fullName: string) => {
  try {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.nodemailer.email,
        pass: config.nodemailer.password,
      },
    });

    // Email HTML template with dynamic placeholders
    const htmlTemplate = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
              }
              .header h2 {
                color: #FF6347; /* Donation App Theme Color */
              }
              .otp {
                font-size: 24px;
                font-weight: bold;
                color: #FF6347;
                padding: 12px;
                background-color: #fff8e1;
                border-left: 4px solid #FF6347;
                text-align: center;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #888888;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
              }

              @media only screen and (max-width: 600px) {
                .container {
                  padding: 15px;
                }
                .otp {
                  font-size: 20px;
                  padding: 10px;
                }
                .footer {
                  font-size: 10px;
                }
                .header h2 {
                  font-size: 22px;
                }
              }
            </style>
          </head>
          <body>

            <div class="container">
              <div class="header">
                <h2>Thank You for Your Commitment to Making a Difference!</h2>
                <p>Your support helps create a brighter future for those in need.</p>
              </div>

              <p>Hello ${fullName},</p>
              <p>We received a request to verify your email address. Your one-time password (OTP) is:</p>

              <div class="otp">
                ${otp}
              </div>

              <p>Please enter this OTP to complete your email verification and continue supporting meaningful causes.</p>
              <p><strong>Note:</strong> This OTP will expire in 5 minutes. Be sure to enter it before it expires.</p>

              <div class="footer">
                <p>Thank you for being a part of our mission. If you did not request this, please ignore this email.</p>
              </div>
            </div>

          </body>
          </html>

  `;

    // Email options: from, to, subject, and HTML body
    const mailOptions = {
      from: config.nodemailer.email, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Your OTP for Account Verification',
      html: htmlTemplate,
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);
  } catch {
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to send email');
  }
};

export default sendOtpEmail;
