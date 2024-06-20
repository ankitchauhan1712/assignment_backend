const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to profile or return token
    if (req.user && req.user.token) {
        res.json({ token: req.user.token });
    } else {
        res.status(500).json({ error: 'Failed to generate token' });
    }
  });

module.exports = router;

 

