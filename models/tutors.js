const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");



//Schema

const tutorSchema = new mongoose.Schema({

 
    username: {
        type: String,
        required: true,
    },

      email: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png",
        set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png" : v,

    },
    subject: [
        {
            type: String,
            required: true,
        }
    ],

    location: {
        type: String,
        required: true,
    },
    areaPin: {
        type: Number,
        required: true,
    },

    contact : {
        type: Number,
        required: true,
    },

      qualification: {
        type: String,
        required: true,
    },

});

//mongoose plugin
tutorSchema.plugin(passportLocalMongoose);
 
//model

const Tutor = mongoose.model("Tutor", tutorSchema);


module.exports = Tutor;
