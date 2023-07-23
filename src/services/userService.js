const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const UserLog = require('../models/UserLog');
require('dotenv').config();

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

async function registerUser(username, password, email) {
  try {
    console.log(typeof(saltRounds))
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Error registering user');
  }
}

async function loginUser(email, password) {
  try {
    console.log("email",email,password)
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    console.log("user",user,user.password,password)
    const passwordMatch =bcrypt.compare(password,user.password);
    console.log("password",passwordMatch)
    console.log(jwtSecret)

    if (!passwordMatch) {
      console.log("error")
      throw new Error('Invalid password');
    }
    console.log(jwtSecret)
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '5m' });
    return { user, token };
  } catch (error) {
    throw new Error('Error logging in user');
  }
}

async function updateAllUserPasswords() {
  try {
    console.log("into update password")
    const users = await User.find();
    for (const user of users) {
      console.log("into send mail")
      const newPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
      await user.save();

      const userLog = new UserLog({
        userId: user._id,
        password: hashedPassword,
        email: user.email,
      });
      await userLog.save();

      sendEmail(user.email, newPassword);
    }
    console.log('All user passwords updated successfully');
  } catch (error) {
    console.error('Error updating user passwords:', error);
  }
}

function sendEmail(email, newPassword) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'your-email@example.com',
    to: email,
    subject: 'Password Update',
    text: `Your new password is: ${newPassword}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

async function getUserLogs() {
  try {
    const userLogs = await UserLog.find().populate('userId');
    return userLogs;
  } catch (error) {
    throw new Error('Error retrieving user logs');
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateAllUserPasswords,
  getUserLogs,
};