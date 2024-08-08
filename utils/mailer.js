const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

const sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error('Error sending email:', err);
    }
  });
};

module.exports = sendMail;
