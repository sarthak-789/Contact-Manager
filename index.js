var express = require('express');
    methodOverride = require('method-override');
    expressSanitizer = require('express-sanitizer');
    app = express();
    bodyParser = require('body-parser');
    mongoose = require('mongoose');
    
mongoose.connect("mongodb://localhost/phoneBookApp", {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var contactSchema = new mongoose.Schema({
    name: String,
    dob: String,
    phone: [Number],
    email: [String]
});

var Contact = mongoose.model("Contact", contactSchema);

Contact.create({
    name: "XYZ",
    dob: "15-06-1995",
    phone: 1234567890,
    email: "abc@email.com"
});

app.get("/", function(request, result){
    res.redirect("/user");
});

app.get("/user", function(request, result){
    Contact.find({}, function(error, contacts){
        if (error){
            console.log(error);
        } else {
            res.render("show", {user: contacts});
        }
    });
});

app.get("/user/new", function(request, result){
    res.render("add_new");
});

app.post("/user", function(request, result){
    Contact.create(req.body.user, function(err, newContact){
        if(err){
            res.render("add_new");
        } else{
            res.redirect("/user");
        }
    });
});

//EDIT Route
app.get("/user/:id/edit", function(requet,result){
    Contact.findById(req.params.id, function(err, foundContact){
        if(err){
            res.redirect("/user");
        } else{
            res.render("edit_contact", {user: foundContact});
        }
    });  
});

//UPDATE Route
app.put("/user/:id", function(request, result){
    Contact.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedHotel){
        if(err){
            res.redirect("/user/edit_contact");
        } else{
            res.redirect("/user");
        }
    }) 
});

//DELETE Route
app.delete("/user/:id", function(request, result){
    Contact.findByIdAndRemove(req.params.id, function(error, deleteContact){
        if(err){
            res.redirect("/user");
        } else{
            res.redirect("/user");
        }
    });
});

app.listen(3000, function(){
    console.log("Sever Successfully Started !");
});