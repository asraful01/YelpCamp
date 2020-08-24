//middleware goes here
var Campground =require("../models/campground");
var Comment =require("../models/comment")

var middlewareobj ={};

middlewareobj.checkCampgroundOwnership = (req,res,next)=>{
        if(req.isAuthenticated()){
            Campground.findById(req.params.id,(err,foundCampground)=>{
                if(err){
                    req.flash("error","campground not found");
                    res.redirect("back");
                }
                else{
                    //does user own the campground
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error","You need permission!");
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
                        req.flash("error","You don't have permission!")
                        res.redirect("back");
                    }
                }
            })
        }
        else{
            req.flash("error","You need to be logged in!");
            res.redirect("back");
        }
    }

    middlewareobj.isLoggedIn=(req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error","You need to logged in first!")
        res.redirect("/login");
    }
    

module.exports= middlewareobj;