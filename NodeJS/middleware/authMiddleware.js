const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.token = token;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Veuillez vous authentifier.' });
    }
  };
  
  module.exports = authMiddleware;