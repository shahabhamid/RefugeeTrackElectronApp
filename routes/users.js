const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
// Add other routes as needed

module.exports = router;