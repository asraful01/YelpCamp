const express           = require("express"),
      app               = express(),
      port              = 3000,
      bodyParser        = require("body-parser"),
      mongoose          = require('mongoose'),
      passport          = require("passport"),
      LocalStrategy     = require ("passport-local"),
      methodOverride    = require("method-override"),
      Campground        = require("./models/campground"),
      Comment           = require("./models/comment"),
      User              = require("./models/user"),
      seedDB            = require("./seeds")
      
const commentRoutes     = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

//===========================================
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
//===========================================
//=======================
//Mongoose connection
//========================
mongoose.connect('mongodb://localhost:27017/campground', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// seedDB(); //seed Database
//====================================
//===========================================
//PASSPORT CONFIG
app.use(require("express-session")({
    secret:"once again",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=================================================
//USING THE ROUTES from routes folder
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
//===========================================
app.listen(port,()=>{
    console.log("app is running");
});