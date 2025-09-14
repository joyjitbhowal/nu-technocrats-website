const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send email function
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        let htmlContent = '';
        
        // Handle different email templates
        switch (options.template) {
            case 'emailVerification':
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Welcome to ${options.context.clubName}!</h2>
                        <p>Hi ${options.context.firstName},</p>
                        <p>Thank you for registering with NU Technocrats Club. Please verify your email address by clicking the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${options.context.verificationUrl}" 
                               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>
                        <p>If you didn't create this account, please ignore this email.</p>
                        <p>Best regards,<br>NU Technocrats Club Team</p>
                    </div>
                `;
                break;

            case 'passwordReset':
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Password Reset Request</h2>
                        <p>Hi ${options.context.firstName},</p>
                        <p>You requested a password reset for your ${options.context.clubName} account.</p>
                        <p>Click the button below to reset your password (link expires in 10 minutes):</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${options.context.resetUrl}" 
                               style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p>If you didn't request this reset, please ignore this email.</p>
                        <p>Best regards,<br>NU Technocrats Club Team</p>
                    </div>
                `;
                break;

            case 'welcomeEmail':
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Welcome to ${options.context.clubName}!</h2>
                        <p>Hi ${options.context.firstName},</p>
                        <p>Your membership application has been approved! Welcome to the NU Technocrats Club community.</p>
                        <p>You can now access all member features and join our activities.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${options.context.loginUrl}" 
                               style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Login to Your Account
                            </a>
                        </div>
                        <p>Best regards,<br>NU Technocrats Club Team</p>
                    </div>
                `;
                break;

            case 'membershipApproved':
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #16a34a;">Congratulations! Your Membership is Approved</h2>
                        <p>Hi ${options.context.firstName},</p>
                        <p>We're excited to inform you that your membership application for ${options.context.clubName} has been approved!</p>
                        <p>You are now an official member and can access all club features including:</p>
                        <ul>
                            <li>Join department activities and projects</li>
                            <li>Attend exclusive member events</li>
                            <li>Access learning resources</li>
                            <li>Participate in hackathons and competitions</li>
                        </ul>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${options.context.loginUrl}" 
                               style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Access Your Account
                            </a>
                        </div>
                        <p>Welcome to the community!<br>NU Technocrats Club Team</p>
                    </div>
                `;
                break;

            case 'membershipRejected':
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #dc2626;">Update on Your Membership Application</h2>
                        <p>Hi ${options.context.firstName},</p>
                        <p>Thank you for your interest in joining ${options.context.clubName}.</p>
                        <p>After careful review, we are unable to approve your membership application at this time.</p>
                        ${options.context.reason ? `<p><strong>Reason:</strong> ${options.context.reason}</p>` : ''}
                        <p>We encourage you to reapply in the future or reach out to us if you have any questions.</p>
                        <p>Best regards,<br>NU Technocrats Club Team</p>
                    </div>
                `;
                break;

            case 'membershipSuspended':
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #f59e0b;">Important: Account Status Update</h2>
                        <p>Hi ${options.context.firstName},</p>
                        <p>We need to inform you that your ${options.context.clubName} membership has been temporarily suspended.</p>
                        ${options.context.reason ? `<p><strong>Reason:</strong> ${options.context.reason}</p>` : ''}
                        <p>If you believe this is in error or would like to discuss this decision, please contact the club administration.</p>
                        <p>Best regards,<br>NU Technocrats Club Team</p>
                    </div>
                `;
                break;

            case 'notification':
                htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Notification from ${options.context.clubName}</h2>
                        <p>Hi ${options.context.firstName},</p>
                        <div style="margin: 20px 0; padding: 20px; background-color: #f9fafb; border-left: 4px solid #2563eb;">
                            ${options.context.content}
                        </div>
                        <p>Best regards,<br>NU Technocrats Club Team</p>
                    </div>
                `;
                break;

            default:
                htmlContent = options.html || options.text || '';
        }

        const message = {
            from: process.env.EMAIL_FROM || 'noreply@nutechnocrats.club',
            to: options.email,
            subject: options.subject,
            html: htmlContent,
            text: options.text
        };

        const info = await transporter.sendMail(message);
        
        console.log(`✅ Email sent successfully to ${options.email}`);
        console.log(`📧 Message ID: ${info.messageId}`);
        
        return {
            success: true,
            messageId: info.messageId
        };

    } catch (error) {
        console.error('❌ Email sending failed:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// Send bulk emails
const sendBulkEmails = async (recipients, emailOptions) => {
    const results = [];
    
    for (const recipient of recipients) {
        try {
            const result = await sendEmail({
                ...emailOptions,
                email: recipient.email,
                context: {
                    ...emailOptions.context,
                    firstName: recipient.firstName || 'Member'
                }
            });
            
            results.push({
                email: recipient.email,
                success: true,
                messageId: result.messageId
            });
        } catch (error) {
            results.push({
                email: recipient.email,
                success: false,
                error: error.message
            });
        }
    }
    
    return results;
};

// Send notification email
const sendNotificationEmail = async (users, subject, content, template = null) => {
    const recipients = users.map(user => ({
        email: user.email,
        firstName: user.firstName
    }));
    
    const emailOptions = {
        subject,
        template: template || 'notification',
        context: {
            content,
            clubName: 'NU Technocrats Club'
        }
    };
    
    return await sendBulkEmails(recipients, emailOptions);
};

// Verify email configuration
const verifyEmailConfig = async () => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️  Email configuration not found. Email features will not work.');
            return false;
        }
        
        const transporter = createTransporter();
        await transporter.verify();
        
        console.log('✅ Email configuration verified successfully');
        return true;
    } catch (error) {
        console.error('❌ Email configuration verification failed:', error.message);
        return false;
    }
};

module.exports = {
    sendEmail,
    sendBulkEmails,
    sendNotificationEmail,
    verifyEmailConfig
};