const { Resend } = require('resend');

// The API key is stored in the environment variable.
// Ask the user to replace it in their .env if it is a placeholder.
const resend = new Resend(process.env.RESEND_API_KEY || 're_xxxxxxxxx');

exports.sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: options.email,
      subject: options.subject,
      html: options.html
    });
    console.log('Email sent successfully via Resend:', data);
    return data;
  } catch (error) {
    console.error('Email could not be sent via Resend:', error);
    throw error;
  }
};
