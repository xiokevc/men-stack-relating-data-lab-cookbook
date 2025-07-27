const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');

// INDEX - show all pantry items for a user
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('foods/index.ejs', { pantry: user.pantry, user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// NEW - show form to add new pantry item
router.get('/new', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('foods/new.ejs', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// CREATE - add new pantry item
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.pantry.push(req.body);
    await user.save();
    res.redirect(`/users/${req.params.userId}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// EDIT - show edit form for a specific pantry item
router.get('/:itemId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const food = user.pantry.id(req.params.itemId);
    res.render('foods/edit.ejs', { user, food });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// UPDATE - process the edit form submission
router.put('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const food = user.pantry.id(req.params.itemId);
    food.set(req.body);
    await user.save();
    res.redirect(`/users/${req.params.userId}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// DELETE - remove a pantry item
router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.pantry.id(req.params.itemId).remove();
    await user.save();
    res.redirect(`/users/${req.params.userId}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;

