const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendConfirmationEmail = (email, username) => {
  const mailOptions = {
    from: `"Elakaromadni" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Registration Confirmation',
    text: `Hello ${username},\n\nThank you for registering with our service.`,
    html: `<p>Hello ${username},</p>
          <p>Thank you for registering with our service.</p>`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Email sending error:', error);
    }
  });
};