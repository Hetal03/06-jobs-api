const express = require('express');
const router = express.Router();

const { register, login, deleteUser } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);

router.delete('/delete-user/:email', deleteUser);

module.exports = router;  
