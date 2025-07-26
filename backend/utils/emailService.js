import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'test@example.com',
    pass: process.env.SMTP_PASS || 'password'
  }
});

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@linkshortener.com',
      to: email,
      subject: 'Welcome to LinkShortener Pro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to LinkShortener Pro!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for joining LinkShortener Pro! You're now ready to create powerful, trackable short links.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What you can do now:</h3>
            <ul>
              <li>Create unlimited short links</li>
              <li>Track detailed analytics</li>
              <li>Generate QR codes</li>
              <li>Set custom expiration dates</li>
            </ul>
          </div>
          
          <p>Get started by logging into your dashboard:</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Go to Dashboard</a>
          
          <p>If you have any questions, feel free to reach out to us.</p>
          <p>Best regards,<br>The LinkShortener Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send payment confirmation email
export const sendPaymentConfirmation = async (email, payment, plan) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@linkshortener.com',
      to: email,
      subject: 'Payment Confirmed - LinkShortener Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Payment Confirmed!</h2>
          <p>Your payment has been successfully processed and your subscription is now active.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Plan:</strong> ${plan.displayName}</p>
            <p><strong>Amount:</strong> ₹${payment.amount}</p>
            <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
            <p><strong>Date:</strong> ${new Date(payment.paidAt).toLocaleDateString()}</p>
            ${payment.invoiceUrl ? `<p><a href="${payment.invoiceUrl}">Download Invoice</a></p>` : ''}
          </div>
          
          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Premium Features:</h3>
            <ul>
              <li>Create up to ${plan.features.maxLinks} links per month</li>
              <li>Track up to ${plan.features.maxClicks} clicks per month</li>
              ${plan.features.customDomain ? '<li>Custom domain support</li>' : ''}
              ${plan.features.apiAccess ? '<li>API access</li>' : ''}
              <li>${plan.features.analytics} analytics</li>
            </ul>
          </div>
          
          <p>Start creating powerful short links now:</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Go to Dashboard</a>
          
          <p>Thank you for choosing LinkShortener Pro!</p>
          <p>Best regards,<br>The LinkShortener Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
  }
};

// Send payment reminder email
export const sendPaymentReminder = async (email, subscription, plan) => {
  try {
    const daysLeft = Math.ceil((subscription.endDate - new Date()) / (1000 * 60 * 60 * 24));
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@linkshortener.com',
      to: email,
      subject: `Your LinkShortener subscription expires in ${daysLeft} days`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Subscription Expiring Soon</h2>
          <p>Your LinkShortener Pro subscription will expire in ${daysLeft} days.</p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Current Plan: ${plan.displayName}</h3>
            <p><strong>Expires on:</strong> ${subscription.endDate.toLocaleDateString()}</p>
            <p>Don't lose access to your premium features!</p>
          </div>
          
          <p>Renew your subscription to continue enjoying:</p>
          <ul>
            <li>Unlimited link creation</li>
            <li>Advanced analytics</li>
            <li>QR code generation</li>
            <li>Custom domains</li>
          </ul>
          
          <a href="${process.env.FRONTEND_URL}/pricing" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Renew Subscription</a>
          
          <p>Best regards,<br>The LinkShortener Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending payment reminder email:', error);
  }
};

// Send analytics report email
export const sendAnalyticsReport = async (email, reportData) => {
  try {
    const { totalLinks, totalClicks, topLinks, period } = reportData;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@linkshortener.com',
      to: email,
      subject: `Your LinkShortener Analytics Report - ${period}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Analytics Report</h2>
          <p>Here's your link performance summary for ${period}:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <div>
                <h3 style="margin: 0; color: #374151;">Total Links</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #2563eb;">${totalLinks}</p>
              </div>
              <div>
                <h3 style="margin: 0; color: #374151;">Total Clicks</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #10b981;">${totalClicks}</p>
              </div>
            </div>
          </div>
          
          ${topLinks.length > 0 ? `
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Top Performing Links:</h3>
              ${topLinks.map(link => `
                <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                  <p style="margin: 0; font-weight: bold;">${link.shortUrl}</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">${link.totalClicks} clicks</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <p>View detailed analytics in your dashboard:</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Dashboard</a>
          
          <p>Best regards,<br>The LinkShortener Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending analytics report email:', error);
  }
};
