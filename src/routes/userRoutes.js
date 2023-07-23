const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const { validateToken } = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/user-logs', userController.getUserLogs);


module.exports = router;