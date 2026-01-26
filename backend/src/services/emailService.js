const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to EventHub! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to EventHub!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your gateway to amazing professional events</p>
          </div>
          
          <div style="background: white; padding: 40px 20px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${user.name}! 👋</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining EventHub! We're excited to help you discover amazing events and connect with like-minded professionals.
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">What's next?</h3>
              <ul style="color: #4b5563; line-height: 1.6;">
                <li>Browse our curated selection of professional events</li>
                <li>Register for events that match your interests</li>
                <li>Connect with industry leaders and peers</li>
                <li>Build your professional network</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/events" 
                 style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Explore Events Now
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
              Need help? Reply to this email or visit our help center.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendRegistrationConfirmation(user, event) {
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mailOptions = {
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Registration Confirmed: ${event.title} ✅`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Registration Confirmed! ✅</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">You're all set for this amazing event</p>
          </div>
          
          <div style="background: white; padding: 40px 20px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${user.name}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              Great news! Your registration for <strong>${event.title}</strong> has been confirmed.
            </p>
            
            <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 20px; font-size: 20px;">${event.title}</h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; align-items: center;">
                  <span style="color: #6b7280; font-weight: bold; width: 80px;">📅 Date:</span>
                  <span style="color: #1f2937;">${eventDate}</span>
                </div>
                
                <div style="display: flex; align-items: center;">
                  <span style="color: #6b7280; font-weight: bold; width: 80px;">📍 Location:</span>
                  <span style="color: #1f2937;">${event.location}</span>
                </div>
              </div>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #92400e; margin: 0; font-weight: 500;">
                📝 Don't forget to add this event to your calendar!
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/events/${event.id}" 
                 style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;
                        margin-right: 10px;">
                View Event Details
              </a>
              
              <a href="${process.env.FRONTEND_URL}/profile" 
                 style="background: white; 
                        color: #374151; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;
                        border: 2px solid #d1d5db;">
                Manage Registrations
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
              Questions about this event? Reply to this email and we'll help you out!
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Registration confirmation sent to ${user.email} for event ${event.title}`);
    } catch (error) {
      console.error('Error sending registration confirmation:', error);
    }
  }

  async sendEventReminder(user, event) {
    const eventDate = new Date(event.date);
    const now = new Date();
    const timeDiff = eventDate - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    let reminderText = '';
    if (daysDiff === 1) {
      reminderText = 'tomorrow';
    } else if (daysDiff === 0) {
      reminderText = 'today';
    } else {
      reminderText = `in ${daysDiff} days`;
    }

    const mailOptions = {
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Reminder: ${event.title} is ${reminderText}! ⏰`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Event Reminder ⏰</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Don't miss this amazing event!</p>
          </div>
          
          <div style="background: white; padding: 40px 20px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${user.name}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              This is a friendly reminder that <strong>${event.title}</strong> is happening ${reminderText}!
            </p>
            
            <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #92400e; margin-top: 0; margin-bottom: 20px; font-size: 20px;">${event.title}</h3>
              
              <div style="display: grid; gap: 15px;">
                <div>
                  <span style="color: #92400e; font-weight: bold;">📅 Date & Time:</span><br>
                  <span style="color: #1f2937; font-size: 18px;">${eventDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                
                <div>
                  <span style="color: #92400e; font-weight: bold;">📍 Location:</span><br>
                  <span style="color: #1f2937; font-size: 16px;">${event.location}</span>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/events/${event.id}" 
                 style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                View Event Details
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
              See you at the event! 🎉
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Event reminder sent to ${user.email} for event ${event.title}`);
    } catch (error) {
      console.error('Error sending event reminder:', error);
    }
  }

  async sendCancellationConfirmation(user, event) {
    const mailOptions = {
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Registration Cancelled: ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Registration Cancelled</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">We're sorry to see you go</p>
          </div>
          
          <div style="background: white; padding: 40px 20px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${user.name},</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              Your registration for <strong>${event.title}</strong> has been successfully cancelled.
            </p>
            
            <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #dc2626; margin-top: 0; margin-bottom: 15px;">Cancelled Event:</h3>
              <p style="color: #1f2937; font-size: 18px; margin: 0;"><strong>${event.title}</strong></p>
              <p style="color: #6b7280; margin: 5px 0 0 0;">${new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              We hope to see you at future events! Check out our other amazing events below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/events" 
                 style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Browse Other Events
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
              Questions? Reply to this email and we'll help you out!
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Cancellation confirmation sent to ${user.email} for event ${event.title}`);
    } catch (error) {
      console.error('Error sending cancellation confirmation:', error);
    }
  }
}

module.exports = new EmailService();