/*
  auth.js uses bcrypt and salt to encode passwords ...

  This router defines the following routes
  /signin (post)
  /login (get and post)
  /logout (get)

  When the user logs in or signs in, 
  it adds their user name and user object to the req.session for use in the app.js controller
  and it sets the res.locals properties for use in the view
  res.locals.loggedIn
  res.local.username
  res.locals.user
*/

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User')



// This is an example of middleware
// where we look at a request and process it!
router.use(function(req, res, next) {
  console.log(`${req.method} ${req.url} ${new Date()}`);
  next();
});


router.use((req,res,next) => {
  if (req.session.username) {
    res.locals.loggedIn = true
    res.locals.username = req.session.username
    res.locals.user = req.session.user
  } else {
    res.locals.loggedIn = false
    res.locals.username = null
    res.locals.user = null
  }
  next()
})


router.get("/login", (req, res) => {
  const loginFailed = req.query.loginFailed === 'true';
  const signupFailed = req.query.signupFailed === 'true';
  res.render("login", { loginFailed: loginFailed, signupFailed: signupFailed });
});


router.post('/login', async (req, res, next) => {
  try {
      const { username, passphrase } = req.body;
      const user = await User.findOne({ username: username });
      const isMatch = user ? await bcrypt.compare(passphrase, user.passphrase) : false;

      if (isMatch) {
          req.session.username = username;
          req.session.user = user;
          res.redirect('/');
      } else {
          req.session.username = null;
          req.session.user = null;
          res.redirect('/login?loginFailed=true');
      }
  } catch (e) {
      next(e);
  }
});

// router.get("/signup", (req, res) => {
//   const signupFailed = req.query.signupFailed === 'true';
//   res.render("signup", { signupFailed: signupFailed });
// });


router.post('/signup', async (req, res, next) => {
  try {
      const { username, passphrase, passphrase2, age } = req.body;
      if (passphrase != passphrase2) {
          res.redirect('/login');
      } else {
          const encrypted = await bcrypt.hash(passphrase, saltRounds);
          const duplicates = await User.find({ username });

          if (duplicates.length > 0) {
              res.redirect('/login?signupFailed=true');
          } else {
              const user = new User({
                  username: username,
                  passphrase: encrypted,
                  age: age
              });

              await user.save();
              req.session.username = user.username;
              req.session.user = user;
              res.redirect('/');
          }
      }
  } catch (e) {
      next(e);
  }
});


router.get('/logout', (req,res) => {
  req.session.destroy()
  res.redirect('/');
})

module.exports = router;

