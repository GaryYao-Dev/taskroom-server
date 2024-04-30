const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'taskroommail@gmail.com',
    pass: 'lkqpzjovhztqdmqz',
  },
});

/**
 * Sends an email using Nodemailer transporter
 *
 * @param {string} subject - Email subject
 * @param {string} to - Recipient email address
 * @param {string} html - Email HTML body
 *
 * @returns {Promise} Promise resolving to Nodemailer info object or rejecting with error
 *
 * This function returns a Promise that resolves with the Nodemailer info object
 * containing information about the sent email. Or rejects with the error if one occurred.
 *
 * The HTML email body is generated dynamically based on username, token
 * and origin URL parameters.
 *
 * A token is generated from the user ID to include in the verify email link.
 *
 * The recipient's username is looked up from the database before sending.
 */
const sendMail = async (subject, to, html) => {
  try {
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: { name: 'TaskRoom', address: 'taskroommail@gmail.com' },
          subject,
          to,
          html,
        },
        (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        },
      );
    });
    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMail };
