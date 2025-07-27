const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');

// INDEX - list foods
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('foods/index.ejs', { pantry: user.pantry });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// NEW - form to add food
router.get('/new', (req, res) => {
  res.render('foods/new.ejs');
});

// CREATE - add food
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.pantry.push({ name: req.body.name });
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// EDIT - form to edit food
router.get('/:itemId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const food = user.pantry.id(req.params.itemId);
    res.render('foods/edit.ejs', { food });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// UPDATE - modify food
router.put('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const food = user.pantry.id(req.params.itemId);
    food.set({ name: req.body.name });
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// DELETE - remove food
router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.pantry.id(req.params.itemId).deleteOne();
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;


