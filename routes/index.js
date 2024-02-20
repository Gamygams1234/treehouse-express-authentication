var express = require("express");
var router = express.Router();
var User = require("../models/User");

// GET /
router.get("/", function (req, res, next) {
  return res.render("index", { title: "Home" });
});

// GET /about
router.get("/about", function (req, res, next) {
  return res.render("about", { title: "About" });
});

// GET /contact
router.get("/contact", function (req, res, next) {
  return res.render("contact", { title: "Contact" });
});

// login
router.get("/login", function (req, res, next) {
  return res.render("login", { title: "Login" });
});

// login
router.post("/login", function (req, res, next) {
  // the login information goes here

  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user){
      if (error ||!user){
        let err = new Error("Invalid credentials")
        err.status = 401
        return next(err)
      }else{
        req.session.userId = user._id
        return res.redirect("/profile")
      }
    })


  } else {
    let err = new Error("Email and password are required ");
    //  bad requrest
    err.status = 401;
    return next(err);
  }
});

// register
router.get("/register", function (req, res, next) {
  return res.render("register", { title: "Register" });
});



// register
router.post("/register", function (req, res, next) {
  if (req.body.name && req.body.favoriteBook && req.body.password && req.body.email && req.body.confirmPassword) {
    // confirming password
    if (req.body.password !== req.body.confirmPassword) {
      let err = new Error("Passwords do not match");
      //  bad requrest
      err.status = 400;
      return next(err);
    } else {
      console.log(req.body.password);
      let userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        favoriteBook: req.body.favoriteBook,
      };
      User.create(userData, (err, user) => {
        if (err) {
          return next(err);
        } else {
          req.session.userId = user._id
          return res.redirect("/profile");
        }
      });
    }
  } else {
    let err = new Error("All Fields Required");
    //  bad requrest
    err.status = 400;
    return next(err);
  }
});

// GET /profile
router.get('/profile', function(req, res, next) {
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
        }
      });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
module.exports = router;
