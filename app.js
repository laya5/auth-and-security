//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

const port = process.env.PORT || 3000;
console.log(process.env.NAME);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect('mongodb://localhost:27017/secretsDB',{useNewUrlParser:true,useUnifiedTopology:true});
const schema= new mongoose.Schema ({
  email:String,
  password:String
});
schema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields:["password"] });
const rl= new mongoose.model("security",schema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
var username= req.body.username;
var pasword=req.body.password;
const newr = new rl({
  email:username,
  password:pasword
});
  newr.save();
  res.render("secrets");
});
app.post("/login",function(req,res){
  rl.findOne({email:req.body.username},function(err,founduser){
    if(founduser.password === req.body.password){
        res.render("secrets");
    }
    else if(err){
      res.send(err);
    }
    else{
      if(founduser.password !== req.body.password){
        res.send("password is incorrect");
      }}

  })    ;
});
app.listen(port, () => console.log(`Server started at port: ${port}`)
);
