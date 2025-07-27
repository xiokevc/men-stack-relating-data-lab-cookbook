// =================== Environment Setup ===================
const dotenv = require('dotenv');
require('dotenv').config();


// =================== Dependencies ===================
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
// const morgan = require('morgan'); // optional logging
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// =================== Controllers ===================
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');

// =================== App Config ===================
const app = express();
const port = process.env.PORT || 3000;

// =================== Database Connection ===================
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);
});

// =================== Middleware ===================
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev')); // enable if you want request logs
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// =================== Custom Middleware ===================
app.use(passUserToView);

// =================== Routes ===================

// Home route
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

// VIP route
app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`🎉 Welcome to the party, ${req.session.user.username}.`);
  } else {
    res.send('🚫 Sorry, no guests allowed.');
  }
});

// Auth routes (sign in / sign up / sign out)
app.use('/auth', authController);

// Pantry routes — only for signed-in users
app.use(isSignedIn); // protect everything below this
app.use('/users/:userId/foods', foodsController);

// =================== Start Server ===================
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});