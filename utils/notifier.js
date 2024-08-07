const transporter = require('../config/email');
require('dotenv')
// const sendEmail = async (to, subject, text) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         text,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${to}`);
//     } catch (error) {
//         console.error(`Error sending email to ${to}:`, error);
//     }
// };

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: '"Research Corridor" <process.env.EMAIL_USER>',
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
    }
};

module.exports = sendEmail;
