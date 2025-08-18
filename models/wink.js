const mongoose = require("mongoose");
const Tutor = require("./tutors.js");
const Parent = require("./parent.js");

const winkSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
    requirementInfo: {
        subject: String,
        grade: String,
        location: String,
        notes: String, // optional additional notes from parent
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending"
    },
    createdAt: { type: Date, default: Date.now, index: { expires: '14d' } },
    updatedAt: { type: Date, default: Date.now }
});

const Wink = mongoose.model("Wink", winkSchema);

module.exports = Wink;
