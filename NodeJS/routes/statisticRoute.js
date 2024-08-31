const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const StatisticController = require('../controllers/statisticController');

router.post('/categ', authMiddleware, StatisticController.addStatCateg);
router.get('/categ', authMiddleware, StatisticController.getStatCategory);

module.exports = router;
