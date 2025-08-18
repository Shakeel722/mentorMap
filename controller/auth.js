

module.exports.loginForm = (req, res)=> {
  res.render("signup/login.ejs");
}

module.exports.login =  (req, res)=> {

   req.flash("success", "You are now logged in");
  //  console.log(req.user);
   res.redirect( res.locals.redirectUrl || "/home");

}

module.exports.logout = async ( req,res )=> {
await  req.logout((err)=> {
    
    if( err){
      return next(err);
    }

    req.flash("success" , "You are logged out");
    res.redirect("/home");
  });

}


