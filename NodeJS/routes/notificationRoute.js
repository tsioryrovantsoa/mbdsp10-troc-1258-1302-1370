const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

router.post('/', authMiddleware, NotificationController.createNotification);
router.get('/unread-count/:userId', authMiddleware, NotificationController.getUnreadNotificationsCount);
router.get('/:userId', authMiddleware, NotificationController.getNotificationsWithPagination);
router.patch('/:notificationId/read', authMiddleware, NotificationController.markAsRead);
module.exports = router;