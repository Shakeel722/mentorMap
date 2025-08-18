//SERVER FILE

// Load environment variables
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const winkRoutes = require("./routes/wink");
const tutorRouter = require("./routes/tutor.js");
const parentRouter = require("./routes/parent.js");
const authenticateRoutes = require("./routes/authentication.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");


const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Tutor = require("./models/tutors.js");
const Parent = require("./models/parent.js");
const { isLoggedIn, saveRedirectUrl } = require('./middleware.js');

const atlasDbUrl= process.env.ATLAS_DB_URL;

//db connect
async function main() {
    mongoose.connect(atlasDbUrl);
}
main().then(()=> {

    console.log("database connected successfully!");
});


//static files
app.use(express.static(path.join(__dirname, "public")));

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// session store setup 
const store = MongoStore.create({
  mongoUrl: atlasDbUrl,
  secret: process.env.SESSION_SECRET ,
  touchAfter: 24 * 3600 // time period in seconds
});

//session setup

const sessionOptions = {
  store:store,
  secret : process.env.SESSION_SECRET , 
  resave: false, 
saveUninitialized: true,

  cookie: {
    expires: Date.now() + 7 * 24* 60*60 * 1000 ,  //milli seconds
    maxAge: 7 * 24* 60*60 * 1000, 
    httpOnly: true,

  }
};

store.on("error", (error) => {
  console.error("MongoDB store error:", error);
});

app.use(session(sessionOptions));

//flash
app.use(flash());


//passport setup (authentication and authorization)

app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStrategy(async (username , password , done)=> { // strategy
  try {

     //search in tutor first
     let tutor = await Tutor.findOne({username});

     if( tutor) {
      return Tutor.authenticate()(username, password, done);
     }

     //search in parent if not in tutor
     let parent = await Parent.findOne({username});
     if( parent) {
      return Parent.authenticate()(username, password, done);
     }

     //Not found
     return done(null, false, {message:"user not found"});

  }
  catch(err) {
    return done(err);
  }
 
}));



passport.serializeUser((user, done) => {
  done(null, { id: user._id.toString(), role: user instanceof Tutor ? "tutor" : "parent" });
});

passport.deserializeUser(async (data, done) => {
  try {
    let user;
    if (data.role === "tutor") user = await Tutor.findById(data.id);
    else user = await Parent.findById(data.id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});



//storing user info  in locals
app.use( (req, res, next)=> {

    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage= req.flash("error");
    res.locals.info = req.flash("info");
    res.locals.currUser = req.user || null;
  next();
});

//ejs setup
app.engine("ejs" , ejsMate);
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, ("/views")));



  //ROUTES
//login routes
app.use("/" , authenticateRoutes);

// wink 
app.use("/", winkRoutes);

//tutor routes
 app.use("/" , tutorRouter);
 
 //parent routes
 app.use("/parent" , parentRouter);


app.get("/" ,(req, res)=> {
  res.redirect("/home");
});



// start server
app.listen(8080 ,  () => {
  console.log("Server is running on port 8080");
});
