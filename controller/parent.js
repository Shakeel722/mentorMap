const Parent = require("../models/parent");
const Wink = require("../models/wink");

module.exports.signupForm =   (req, res)=> {
    res.render("signup/parent.ejs");
}

module.exports.registerParent = async (req, res) => {
    try {
        let { username, location, email, password, areaPin } = req.body;

        let newParent = new Parent({
            username: username.trim(),
            email: email.trim(),
            location: location.trim(),
            areaPin: areaPin,
        });

        let registeredParent = await Parent.register(newParent, password); // storing to db

        //automatic login after registration
        req.login(registeredParent, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Registration completed you are logged In");
            res.redirect("/home")
        });
    }
    catch (err) {
        console.error(err);
        req.flash("error", err.message); // show real message
        res.redirect("/signup");
    }
}

module.exports.parentDashboard = async (req, res) => {
    try {
        const parentId = req.user._id;

        // Get all winks sent by this parent
        const winks = await Wink.find({ parentId })
            .populate("tutorId"); // get tutor details

        // Get parent details
        const parent = await Parent.findById(parentId);

        res.render("pages/parent-dashboard.ejs", { winks, parent });
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not load dashboard.");
        res.redirect("/home");
    }
}