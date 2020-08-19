const express       = require("express"),
      app           = express(),
      port          = 3000,
      bodyParser    = require("body-parser"),
      mongoose      = require('mongoose'),
      passport      = require("passport"),
      LocalStrategy = require ("passport-local"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      User          = require("./models/user"),
      seedDB        = require("./seeds")
      
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");

mongoose.connect('mongodb://localhost:27017/campground', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
seedDB();

//passport config
app.use(require("express-session")({
    secret:"once again",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
    res.render("landing");
});
//index --display a list of all campgrounds
app.get("/campgrounds",(req,res)=>{
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
app.post("/campgrounds",(req,res)=>{
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
app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new");
})

//show ROUTES-- view info about campground
app.get("/campgrounds/:id",(req,res)=>{
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
//=========================
//COMMNETS ROUTES
//==========================
app.get("/campgrounds/:id/comments/new",(req,res)=>{
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
app.post("/campgrounds/:id/comments",(req,res)=>{
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

//AUTH ROUTES

//SHOW register form
app.get("/register",(req,res)=>{
    res.render("register");
})
//handle sign up 
app.post("/register",(req,res)=>{
   var newUser=new User({username:req.body.username})
   User.register(newUser,req.body.password,(err,user)=>{
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res,()=>{
        res.redirect("/campgrounds");
       })
    
   })
});

app.listen(port,()=>{
    console.log("app running");
});