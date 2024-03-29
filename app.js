require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


//userSchema.plugin(encrypt,{secret:secret}); // by this we encrypt that message and this is always placed before we initialize the model and by this we encrypted all the fields so to encrypted only a single field we specift that field
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]}); // by this we only encrypt the password and if we want to encrypt multiple field then we can write it in the array
const User = new mongoose.model("User",userSchema);




app.listen(3000,function(){
    console.log('listening on port 3000');
})

app.get('/', function(req,res){
    res.render("home");
});

app.get('/register', function(req,res){
    res.render("register");
});

app.get('/login', function(req,res){
    res.render("login")
});

app.get('/logout',function(req,res){
    res.render('home');
})
app.post('/register',function(req, res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    })
    
    newUser.save(function(err){
        if(err)
        { o
        console.log(err);}
        else{
            res.render("secrets");
        }
    })
})

app.post('/login', function(req, res){
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email:userName},function(err,founduser){
        if(err)
        { console.log(err);}
        else{
            if(founduser)
            { if(founduser.password === password){
                res.render("secrets");
            }}
        }
    })
})