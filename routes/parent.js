const express = require("express");
const router = express.Router();
const { validateParent } = require("../middleware.js");
const { isLoggedIn} = require("../middleware.js");
const {signupForm, registerParent, parentDashboard } = require("../controller/parent.js");


// signup form
router.get("/" , signupForm);

//registering to db
router.post("/", validateParent,  registerParent );

// Parent dashboard - show all winks
router.get("/dashboard", isLoggedIn , parentDashboard);

module.exports = router;
