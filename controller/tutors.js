const Wink = require("../models/wink");
const Tutor = require("../models/tutors");

module.exports.homePage = (req, res) => {
  
    res.render("pages/home.ejs" , {res});
}

module.exports.aboutPage = (req, res) => {
    res.render("pages/about.ejs");
}

module.exports.searchTutor = async (req, res) => {
  try {
    let { subject, grade, location, areaPin } = req.body;

    // Clean inputs
    subject = subject?.trim().toLowerCase();
    grade = grade?.trim();
    location = location?.trim().toLowerCase();
    const pin = parseInt(areaPin?.toString().trim(), 10);

    // Build dynamic $or query
    const conditions = [];

    if (subject) {                
      // subject is an array in DB, so use $in
      conditions.push({ subject: { $in: [subject] } });
    }
    if (location) {
      conditions.push({ location: location });
    }
    if (!isNaN(pin)) {
      conditions.push({ areaPin: pin });
    }

    let tutors = [];

    if (conditions.length > 0) {
      tutors = await Tutor.find({ $or: conditions });
    }

    // Pass tutors and search data to EJS
    res.render("pages/tutors", {
      tutors,
      searchData: { subject, grade, location, areaPin: pin },
      success: req.flash("success"),
      error: req.flash("error"),
      info: req.flash("info")
    });

  } catch (err) {
    console.error("Error finding tutors:", err);
    req.flash("error", "Something went wrong while searching for tutors.");
    res.redirect("/home");
  }
}

module.exports.reloadAfterWink = async (req, res) => {
  try {
    let { subject, grade, location, areaPin } = req.query;

    subject = subject?.trim().toLowerCase();
    location = location?.trim().toLowerCase();
    const pin = parseInt(areaPin?.toString().trim(), 10);

    const conditions = [];
    if (subject) conditions.push({ subject: { $in: [subject] } });
    if (location) conditions.push({ location });
    if (!isNaN(pin)) conditions.push({ areaPin: pin });

    let tutors = [];
    if (conditions.length > 0) tutors = await Tutor.find({ $or: conditions });

    res.render("pages/tutors", {
      tutors,
      searchData: { subject, grade, location, areaPin }
    });
    
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while loading tutors.");
    res.redirect("/home");
  }
}

module.exports.registrationForm = (req, res)=> {
    res.render("pages/register.ejs");
}


module.exports.tutorRegistration = async (req, res) => {
  try {
    let { username, email, password, subject, location, areaPin, qualification, contact } = req.body;
    const image = req.file.path; // file path for image

    const newTutor = new Tutor({
      username: username,
      email: email?.trim(),
      image: image,
      subject: subject.trim().split(",").map(s => s.trim()), // split by comma and trim each subject
      location: location?.trim(),
      areaPin: areaPin,
      contact: contact,
      qualification: qualification?.trim(),
    });


    let registeredTutor = await Tutor.register(newTutor, password); // storing to db by passport

    console.log(registeredTutor);

    // automatic login
    req.login(registeredTutor, (err) => {
      if (err) {
        req.flash("error", "Registration failed. Please try again.");
        return next(err);
      }

      req.flash("success", `Registration completed you are logged In`);
      res.redirect("/home");
    });

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
}

module.exports.recievedWinks = async (req, res) => {
    try {
        const tutorId = req.user._id;

        // Find all pending winks for this tutor
        const winks = await Wink.find({ tutorId, status: "pending" })
            .populate("parentId"); // populate parent info

        res.render("pages/dashboard", { winks });
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not load dashboard.");
        res.redirect("/");
    }
}

module.exports.acceptWink =  async (req, res) => {
    try {
        const wink = await Wink.findById(req.params.winkId);
        if (!wink) {
            req.flash("error", "Requestnot found.");
            return res.redirect("/tutor/dashboard");
        }

        wink.status = "accepted";
        await wink.save();

        req.flash("success", "You accepted the request! Parent can now see your contact.");
        res.redirect("/tutor/dashboard");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong.");
        res.redirect("/tutor/dashboard");
    }
}

module.exports.declineWink = async (req, res) => {
    try {
        const wink = await Wink.findById(req.params.winkId);
        if (!wink) {
            req.flash("error", "Requestnot found.");
            return res.redirect("/tutor/dashboard");
        }

        wink.status = "declined";
        await wink.save();

        req.flash("info", "You declined the request.");
        res.redirect("/tutor/dashboard");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong.");
        res.redirect("/tutor/dashboard");
    }
}

