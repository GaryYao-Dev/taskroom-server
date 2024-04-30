const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Create JWT payload
  const payload = {
    id: user.id
  };

  // Sign token
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  }
  catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};

