var express     = require("express");
var router      = express.Router({mergeParams:true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

//=========================
//COMMNETS NEW
//==========================
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,(req,res)=>{
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
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,(req,res)=>{
    //find by id
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            req.flash("error","Something went wrong");
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
        Comment.create(req.body.comment,(err,comment)=>{
            if(err){
                console.log(err);
            }
            else{
                //add username and id to comment
                comment.author.id= req.user._id;
                comment.author.username= req.user.username;
                //save comment
                comment.save()
                campground.comments.push(comment);
                req.flash("success","Successfully comment added");
                res.redirect("/campgrounds/" + campground._id);
            }
        })
        }
    })
    
})
//=========================
//COMMNETS EDIT
//==========================
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    })
    
})
//=========================
//COMMNETS UPDATE
//==========================
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
    if(err){
        res.redirect("back");
    }
    else{
        res.redirect("/campgrounds/"+req.params.id);
    }
})
});
//=========================
//COMMNETS DESTROY
//==========================
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    
})



module.exports=router;