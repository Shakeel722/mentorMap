//authentication routes
const express = require("express");
const router = express.Router();
const passport = require("passport");
const {loginForm , login , logout} = require("../controller/auth.js");
const {saveRedirectUrl , isLoggedIn} = require("../middleware.js");

router.get("/login", loginForm);

router.post("/login", saveRedirectUrl ,  passport.authenticate("local" , {failureRedirect:"/login" , failureFlash: true}) , login);

router.get("/logout" ,isLoggedIn , logout);

module.exports = router;