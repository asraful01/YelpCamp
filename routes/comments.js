var express     = require("express");
var router      = express.Router({mergeParams:true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment")

//=========================
//COMMNETS NEW
//==========================
router.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
    //find by id
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground:campground});
        }
    })
    
})
//=========================
//COMMNETS create
//==========================
router.post("/campgrounds/:id/comments",isLoggedIn,(req,res)=>{
    //find by id
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
        Comment.create(req.body.comment,(err,comment)=>{
            if(err){
                console.log(err);
            }
            else{
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/" + campground._id);
            }
        })
        }
    })
    
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;