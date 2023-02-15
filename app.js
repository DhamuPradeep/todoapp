//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");

const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");


mongoose.set('strictQuery',false);
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

const itemsSchema = {
  item: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  item: "Eating"
});

const item2 = new Item({
  item: "Developing"
});

const item3 = new Item({
  item: "Celebebrating the New Year!!!"
});

const defaultA = [item1,item2,item3];

const ListSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List",ListSchema);


app.get("/",function(req,res){

Item.find({},function(err,founditems){

    if(founditems.length == 0){
      Item.insertMany(defaultA,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully Added to Data Base.");
        }
      });
    }
    const day = date.getDate();
    res.render("list",{today:"Today",newitems:founditems});
  });
});

app.get("/about",function(req,res){
  res.render("about");
});

app.get("/signup",function(req,res){
  res.render("signup");
});

app.get("/:customname",function(req,res){
  const customname = req.params.customname;

  List.findOne({name: customname},function(err,foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name: customname,
          items: defaultA
        });
        list.save();
        res.redirect("/"+customname);
      }else{
        res.render("list",{today:foundList.name,newitems:foundList.items});
      }
    }
  });
});


app.post("/delete",function(req,res){
  const delitem = req.body.checkbox;
  Item.findByIdAndRemove(delitem,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Item deleted Successfully!!!");
      res.redirect("/");
    }
  });
});

app.post("/",function(req,res){
  const itemName = req.body.newItem;
  const listName = req.body.button;
  const item0 = new Item({
    item: itemName
  });
  if(listName == "Today"){
    item0.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName},function(err,foundList){
      foundList.items.push(item0);
      foundList.save();
      res.redirect("/"+listName);
    });
  }
});

app.listen(3000,function(){
  console.log("Server is runnig in port 3000");
});
