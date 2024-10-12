const User = require("../models/user");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res) => {
    try{
     let {username, email, password} = req.body;
     const newUser = await User({email, username});
     const registeredUser = await User.register(newUser, password);
     req.login(registeredUser, (err) => {
       if(err) {
         return next();
       }  
       else {
         req.flash("success", "Welcome to TripNstay!");
         res.redirect("/listings");
       }
     })
     
    } catch(e) {
     req.flash("error", e.message);
     res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to TripNStay!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are Logged out!");
        res.redirect("/listings");
    })
};