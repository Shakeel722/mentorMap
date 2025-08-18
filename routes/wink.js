const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware.js");
const {parentWinkTutor } = require("../controller/wink.js");


// Parent sends a wink to a tutor
router.post("/wink/:tutorId", isLoggedIn, parentWinkTutor);


module.exports = router;
