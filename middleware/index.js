//middleware goes here
var Campground =require("../models/campground");
var Comment =require("../models/comment")

var middlewareobj ={};

middlewareobj.checkCampgroundOwnership = (req,res,next)=>{
        if(req.isAuthenticated()){
            Campground.findById(req.params.id,(err,foundCampground)=>{
                if(err){
                    res.redirect("back");
                }
                else{
                    //does user own the campground
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        res.redirect("back");
                    }
                }
            })

        }
        else{
            res.redirect("back");
        }
    }

     middlewareobj.checkCommentOwnership= (req,res,next)=>{
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,(err,foundComment)=>{
                if(err){
                    res.redirect("back");
                }
                else{
                    //does user own the campground
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        res.redirect("back");
                    }
                }
            })
    
        }
        else{
            res.redirect("back");
        }
    }

    middlewareobj.isLoggedIn=(req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    }
    

module.exports= middlewareobj;