const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendMail = require('../utils/mailer');

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: 'User not found' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const mailOptions = {
    to: user.email,
    from: 'passwordreset@demo.com',
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
      http://localhost:3000/reset/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  sendMail(mailOptions);

  res.send({ message: 'Email sent' });
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

  if (!user) {
    return res.status(400).send({ message: 'Password reset token is invalid or has expired.' });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.send({ message: 'Password has been reset.' });
};
