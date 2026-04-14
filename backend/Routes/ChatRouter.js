const { chat } = require('../Controllers/ChatController');
const { authenticateToken } = require('../Middlewares/AuthMiddleware');

const router = require('express').Router();

router.post('/message', authenticateToken, chat);

module.exports = router;