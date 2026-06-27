const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for the given user ID.
 * @param {number} id
 * @returns {string}
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

module.exports = generateToken;
