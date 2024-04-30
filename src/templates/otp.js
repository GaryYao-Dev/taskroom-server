const html = (username, otp) => `
  <html>
  <head>
    <!-- styles -->
  </head>

  <body>
    <div class="email-container">
      <h1>Reset your password</h1>

      <p>Hi ${username}</p>

      <p>Please enter this OTP code to reset your password:</p>

      <p><b>${otp}</b></p>

      <p>This OTP code will expire in 5 minutes.</p> 

      <p>Once verified, you can set a new password for your account.</p>

      <p>Thanks for using Task Room!</p>

      <p>Best regards,</p>

      <p>The Task Room Team</p>
    </div>
  </body>
</html>
`;

module.exports = {
  html,
};
