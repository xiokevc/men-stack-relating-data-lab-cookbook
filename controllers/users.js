// controllers/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// View user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    res.render('users/show.ejs', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// (Optional) Edit user profile form
router.get('/:userId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('users/edit.ejs', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// (Optional) Handle user update
router.put('/:userId', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      username: req.body.username,
      // Add other fields here if needed
    });
    res.redirect(`/users/${req.params.userId}`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
