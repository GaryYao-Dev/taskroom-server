const html = (username, token, origin) => `
<html>
<head>
  <style>
    .email-container {
      width: 800px;
      margin: 0 auto;
    }
    h1 {
      font-size: 24px;
    }
    p {
      font-size: 16px;
    }
    a {
      font-size: 18px;
      color: #007bff;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <h1>Reset your password</h1>
    <p>Hi ${username}!</p>
    <p>Please click the link below or copy and paste it into your web browser to verify your email address and complete your password reset:</p>
    <a href="${origin}/resetPassword/${token}"
      >${origin}/resetPassword/${token}</a
    >
    <p>
      Thanks for signing up! We're excited to have you as part of Task Room.
    </p>
    <p>Best regards,</p>
    <p>The Task Room Team</p>
  </div>
</body>
</html>
`;

module.exports = {
  html,
};
