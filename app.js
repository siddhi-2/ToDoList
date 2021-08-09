
//const { render }  =  require("ejs");
const express = require("express");
//const date = require(__dirname+"/date.js");

const mongoose=require("mongoose");
const _ =require("lodash");

//console.log(date());


const app=express();

app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

//let items=["Buy Groceries","Study DS","Clean the closet"];
//let workItems=[];

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});

const itemsSchema =  {
 name : String
};

const  Item  = mongoose.model("Item ",itemsSchema);

const item1 =new Item ({
    name:"Welcome to your Todolist"
});

const item2 =new Item({
   name :" <-- Hit this to delete an item "
});

const item3= new Item({
   name:"Hit the + button to add a new item."
});

const defaultItems = [item1,item2,item3];

const listSchema = {

    name: String ,
    items : [itemsSchema]
};

const List = mongoose.model("List",listSchema);



/*Item.insertMany(defaultItems,function(err){
    if(err)
    {
        console.log(err);
    }
    else {
        console.log("Successfully inserted!");
    }


});*/


app.get("/",function(req,res)
{


  //let day=date();

   //let day=date.getDay(); //if there are more than one function in our module.

   ///res.render("list",{ listTitle:day,   newListItems: items });
   



 Item.find({},function(err,foundItems)

 { 
     if(foundItems.length==0)
     {
        Item.insertMany(defaultItems,function(err){
            if(err)
            {
                console.log(err);
            }
            else {
                console.log("Successfully inserted!");
            }
        });
        res.redirect("/");
     }
  else 
  {
            res.render("list",{ listTitle:"Today",  newListItems: foundItems });
            console.log(foundItems);
  }
 });
  


  /*   res.send("Hello");  
   var today= new Date();
  var currentDay= today.getDay();
   var day="";
   if(currentDay==6 || currentDay==0)
   {
     day="weekend";
       day=currentDay;
       res.sendFile(__dirname+"/index.html");
     
   }
   else
   {
    day="weekday";
      day=currentDay;
       res.sendFile(__dirname+"/index.html");
  }
  switch(currentDay)
  {
        case 0: 
             day="Sunday";
            break;
        case 1: 
            day="Monday";
            break;
        case 2: 
            day="Tuesday";
            break;
        case 3: 
            day="Wednesday";
            break;
        case 4: 
            day="Thursday";
            break;  
        case 5: 
            day="Friday";
            break;
        case 6: 
            day="Saturday";
            break;
        default:
               console.log("Errpr: Current day is equal to:"+currentDay);

  }

  var options ={
       weekday: "long",
       day: "numeric",
       month: "long"
    };

    var day=today.toLocaleDateString("en-US",options);
    */
 
  
});

app.get("/:customlistName",function(req,res){
    //console.log(req.params.customlistName);
    const customlistName=_.capitalize(req.params.customlistName);

    List.findOne({name:customlistName},function(err,foundList){
        if(!err)
        {
            if(!foundList)
            {
               // console.log("Doesn't exists. ");
               //Create new list
               const list =new List({
                name : customlistName,
                items: defaultItems
            });
       
            list.save();
            res.redirect("/"+customlistName);
            }
            else
            {
                //console.log("Exists");
                //show an existing list
                res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
            }
        }

    });

   
});

app.post("/",function(req,res)
{

  const itemName= req.body.newItem;
  const listName =req.body.list;

  const item = new Item({   //document
      name: itemName
  });
  if(listName==="Today")
  {
  item.save();

   res.redirect("/");
  }
  else
  {
      List.findOne({name : listName},function(err,foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/"+listName);
      });
  }
   
  /* const item =req.body.newItem;
    if(req.body.list=="Work")
    {
        workItems.push(item);
        res.redirect("/work");
    }  
    else
    {

        items.push(item);
        res.redirect("/");

        }*/

    
  // console.log(newItemoflist);

 
   
});


app.post("/delete",function(req,res){
   // console.log(req.body.checkbox);
   const checkItemId = req.body.checkbox;
   const listName =req.body.listName;

   if(listName==="Today"){
   Item.findByIdAndRemove(checkItemId,function(err){
       if(err)
       {
           console.log(err);
       }
       else
       {
           console.log("Successfullly deleted checked item.");
       }
    res.redirect("/");
   });
}
else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkItemId}}},function(err,foundList)
    //this  pulls an item of id checkItemId from an array called items and then update it by removing it.
    {
      if(!err)
    {
        res.redirect("/"+listName);
    }

    })
}
});

/*app.get("/work",function(req,res)
{
   res.render("list",{listTitle:"Work List", newListItems : workItems});
})*/

app.get("/about",function(req,res)
{
    res.render("about");
})

app.listen(3000,function(){
    console.log("Server is runnuing on port 3000");
});
