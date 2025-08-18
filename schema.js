const joi = require("joi");


module.exports.tutorSchema = joi.object({
    username: joi.string().required(),
    email: joi.string().required(),
    image: joi.string().required(),
    subject: joi.array().items(joi.string()).required(),
    location: joi.string().required(),
    areaPin: joi.number().required(),
    contact: joi.number().required(),
    qualification: joi.string().required()
});



module.exports.parentSchema = joi.object({
    username: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    location: joi.string().required(),
    areaPin: joi.number().required()
});
