const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");



//Schema

const parentSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: true,
    },
    areaPin: {
        type: Number,
        required: true,
    },

});

parentSchema.plugin(passportLocalMongoose);

//model

const Parent = mongoose.model("Parent", parentSchema);


module.exports = Parent;
