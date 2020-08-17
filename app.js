const express       = require("express"),
      app           = express(),
      port          = 3000,
      bodyParser    = require("body-parser"),
      mongoose      = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
mongoose.connect('mongodb://localhost:27017/campground', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);
// Campground.create(
//     {
//         name: "sgranite hills",
//         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSabmC-wYjUAowZxOu6YW_nuUBtnoIHhZ6aaQ&usqp=CAU",
//         description:"this a hills"    
//     },
//     function(err,campground){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("Successfully added");
//         }
//     });

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
        res.render("index",{campgrounds:allCampgrounds});
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
app.get("/campgrounds/new",(req,res)=>{
    res.render("new");
})

//show -- view info about campground
app.get("/campgrounds/:id",(req,res)=>{
    //Find the camground with provided id
    Campground.findById(req.params.id,(err,foundcampground)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{campground:foundcampground});
        }
    })
})

app.listen(port,()=>{
    console.log("app running");
});