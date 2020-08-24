var express     =   require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");


router.get("/",(req,res)=>{
    res.render("landing");
});
//AUTH ROUTES

//SHOW register form
router.get("/register",(req,res)=>{
    res.render("register");
})
//handle sign up 
router.post("/register",(req,res)=>{
   var newUser=new User({username:req.body.username})
   User.register(newUser,req.body.password,(err,user)=>{
       if(err){
        req.flash("error",err.message);
           return res.render("register");
       }
       passport.authenticate("local")(req, res,()=>{
        req.flash("success","Welcome to YelpCamp" + user.username);
        res.redirect("/campgrounds");
       })
    
   })
});
//show login form
router.get("/login",(req,res)=>{
    res.render("login");
})
//handle login logic
router.post("/login", passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),(req,res)=>{ 
});

//LOGOUT ROUTE
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Successfully logged out!")
    res.redirect("/campgrounds");
})

module.exports=router;