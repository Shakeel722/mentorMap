const express = require("express");
const router = express.Router();
const multer = require("multer");

const {storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { validateTutor } = require("../middleware.js");
const { isTutorLoggedIn } = require("../middleware.js");
const {homePage , aboutPage, searchTutor, reloadAfterWink, registrationForm, tutorRegistration, recievedWinks, acceptWink, declineWink } = require("../controller/tutors.js");






//Routes

//home
router.get("/home", homePage);

//about
router.get("/about", aboutPage);

//find tutors  
router.post("/tutors", isTutorLoggedIn, searchTutor );
  
// to show after a wink
router.get("/tutors", isTutorLoggedIn, reloadAfterWink );


//register 
router.get("/register" , registrationForm);



// register a tutor
router.post("/register/tutor", validateTutor, upload.single("image"), tutorRegistration);

 // wink system

// Tutor dashboard - show pending winks
router.get("/tutor/dashboard", isTutorLoggedIn, recievedWinks );


// Accept a wink
router.post("/wink/accept/:winkId", isTutorLoggedIn, acceptWink);


// Decline a wink
router.post("/wink/decline/:winkId", isTutorLoggedIn, declineWink);


module.exports = router;
