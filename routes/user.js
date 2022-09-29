const express = require('express');
const router = express.Router();
const usrCtrl = require('../controllers/user');

router.post('/signup', usrCtrl.signup);
router.post('/login', usrCtrl.login);

module.exports = router; 