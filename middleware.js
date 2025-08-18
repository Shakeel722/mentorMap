const{parentSchema } = require("./schema.js");
const { tutorSchema } = require("./schema.js");

//checks if the parent is logged In
module.exports.isLoggedIn = (req, res,  next) => {

 if(!req.isAuthenticated()) { 
     
    if( req.method == "GET") {
      req.session.redirectUrl = req.originalUrl;
    }
    else {
        req.session.redirectUrl = "/home";
    }

    console.log("req.url and method: " , req.originalUrl , req.method);
    console.log("req.session.redirectURl:  " , req.redirecUrl);

     req.flash("error" , "you must be logged in first to access it");
     return res.redirect("/login");

    }
  
   next(); 
}



module.exports.saveRedirectUrl = (req, res, next) => {

    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log("res.locals.redirectUrl: " , res.locals.redirecUrl);
      
    }
 
   next();
}


module.exports.validateParent = function validateParentRegistration(req, res, next) {
    const { error } = parentSchema.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/parent");
    }
    next();
}

module.exports.validateTutor = function validateTutor(req, res, next) {
  const { error } = tutorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("/register");
  }
  next();
}

// Middleware to ensure tutor is logged in and store redirect URL for GET requests
module.exports.isTutorLoggedIn = function isTutorLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    } else {
      req.session.redirectUrl = "/home";
    }
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
}