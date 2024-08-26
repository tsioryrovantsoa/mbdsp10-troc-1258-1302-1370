const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ message: 'Veuillez vous authentifier.', error: error.message });
  }
};
  
module.exports = authMiddleware;