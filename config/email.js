const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 487,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

module.exports = transporter;
