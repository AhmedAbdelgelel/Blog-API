const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Send email helper function
const sendEmail = async (options) => {
    const transporter = createTransporter();
    
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
};

/**
 * Send verification email to user
 * @param {Object} user - User object
 * @param {string} verificationUrl - Verification URL
 */
const sendVerificationEmail = async (user, verificationUrl) => {
    const message = `
        <h1>Email Verification</h1>
        <p>Hi ${user.username},</p>
        <p>Please click on the link below to verify your email:</p>
        <a href="${verificationUrl}" target="_blank">Verify Email</a>
        <p>If you did not request this email, please ignore it.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification',
            html: message,
        });
    } catch (err) {
        console.error('Error sending verification email:', err);
        throw new Error('Email could not be sent');
    }
};

/**
 * Send password reset email to user
 * @param {Object} user - User object
 * @param {string} resetUrl - Reset URL
 */
const sendPasswordResetEmail = async (user, resetUrl) => {
    const message = `
        <h1>Reset Password</h1>
        <p>Hi ${user.username},</p>
        <p>You requested to reset your password. Please click on the link below:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>If you did not request this email, please ignore it.</p>
        <p>This link will expire in 10 minutes.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            html: message,
        });
    } catch (err) {
        console.error('Error sending reset email:', err);
        throw new Error('Email could not be sent');
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};
