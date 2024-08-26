const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

router.post('/', NotificationController.createNotification);

module.exports = router;