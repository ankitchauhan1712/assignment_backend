const express = require('express');
const authRoutes = require('./auth');
const accountRoutes = require('./account');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);

module.exports = router;
