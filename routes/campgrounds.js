var express     =   require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");

//index --display a list of all campgrounds
router.get("/campgrounds",(req,res)=>{

    Campground.find({},(err,allCampgrounds)=>{
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });    
    });
    //create --form 
router.post("/campgrounds",middleware.isLoggedIn,(req,res)=>{
        //get data from from and add to campgrounds

        var name    = req.body.name;
        var price   = req.body.price;
        var image   = req.body.image;
        var des     = req.body.description;
        var author  =
        {
            id: req.user._id,
            username:req.user.username
        }
    var newcamp= {name:name, image:image,price:price,description:des,author:author}
        //create new camground and save to DB
        Campground.create(newcamp,(err, newlyadded)=>{
            if(err){
                console.log(err);
            }
            else{
                //redirect to campground page 
                res.redirect("/campgrounds");
            }
        })
    })
    //NEW ROUTES
router.get("/campgrounds/new",middleware.isLoggedIn,(req,res)=>{
        res.render("campgrounds/new");
    })
    
    //show ROUTES-- view info about campground
router.get("/campgrounds/:id",(req,res)=>{
        //Find the camground with provided id
        Campground.findById(req.params.id).populate("comments").exec((err,foundcampground)=>{
            if(err){
                console.log(err);
            }
            else{
                res.render("campgrounds/show",{campground:foundcampground});
            }
        })
    })
    //EDIT Campground Route
    router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
            Campground.findById(req.params.id,(err,foundCampground)=>{
                res.render("campgrounds/edit",{campground:foundCampground});
            });  
    })
    router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
        //find and update
        Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updateCamp)=>{
            if(err){
                res.redirect("/campgrounds");
            }
            else{
                res.redirect("/campgrounds/"+req.params.id);
            }
        })
        //redirect
    })
    //Destroy campground Route
    router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
        Campground.findByIdAndRemove(req.params.id,(err)=>{
            if(err){
                res.redirect("/campgrounds");
            }
            else{
                res.redirect("/campgrounds");
            }
        })
    })

   
    

    module.exports=router;