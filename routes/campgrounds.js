var express     =   require("express");
var router      = express.Router();
var Campground  = require("../models/campground");

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
router.post("/campgrounds",(req,res)=>{
        //get data from from and add to campgrounds
        
        var name    = req.body.name;
        var image   =req.body.image;
        var des     = req.body.description;
        var newcamp= {name:name, image:image,description:des}
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
router.get("/campgrounds/new",(req,res)=>{
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

    module.exports=router;