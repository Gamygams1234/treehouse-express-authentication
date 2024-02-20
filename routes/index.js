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
    }else{

      console.log(req.body.password)
      let userData = {
        email: req.body.email,
        name : req.body.name,
        password: req.body.password,
        favoriteBook: req.body.favoriteBook
      }
      User.create(userData, (err, user)=>{
        if (err){
          return next(err)
        }else{
          return res.redirect('/profile')
        }
      })


    }

  } else {
    let err = new Error("All Fields Required");
    //  bad requrest
    err.status= 400;
    return next(err);
  }
});

module.exports = router;
