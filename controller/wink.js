const Wink = require("../models/wink");

module.exports.parentWinkTutor = async (req, res) => {
    try {
        const parentId = req.user._id; // logged-in parent
        const tutorId = req.params.tutorId;

        const { subject, grade, location, areaPin, notes } = req.body;

        // Check if a wink already exists
        const existing = await Wink.findOne({ parentId, tutorId });
        if (existing) {
            req.flash("info", "You already sent a request to this tutor.");
            // Redirect back with query params
            return res.redirect(`/tutors?subject=${subject || ''}&grade=${grade || ''}&location=${location || ''}&areaPin=${areaPin || ''}`);
        }

        // Create a new wink
        const wink = new Wink({
            parentId,
            tutorId,
            requirementInfo: { subject, grade, location, notes },
            status: "pending"
        });

        await wink.save();

        req.flash("success", "Request sent successfully!");
        // Redirect back to the same tutors search
        res.redirect(`/tutors?subject=${subject || ''}&grade=${grade || ''}&location=${location || ''}&areaPin=${areaPin || ''}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Try again.");
        res.redirect(`/tutors?subject=${req.body.subject || ''}&grade=${req.body.grade || ''}&location=${req.body.location || ''}&areaPin=${req.body.areaPin || ''}`);
    }
}