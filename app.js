const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require('mongoose');
const _=require("lodash");

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://admin-kavyansh:kavyansh11@cluster0.ijogb.mongodb.net/listdb',{useNewUrlParser:true});

const listSchema=new mongoose.Schema({
    name:{
        type:String
    }
});

const Todolist=mongoose.model('Todolist',listSchema);

// const item1=new Todolist({
//     name:"This is item1."
// });

// const item2=new Todolist({
//     name:"This is item2."
// });

// const item3=new Todolist({
//     name:"This is item3."
// });

const arr=[];


app.get('/',function(req,res){
    
    Todolist.find({},function(err,x){
        //{} makes x as array
        //this will check in an array
        // if(x==0)
        // {
        //     Todolist.insertMany(arr,function(err){
        //         if(err)
        //         {
        //             console.log(err);
        //         }
        //         else
        //         {
        //             console.log('Inserted successfully');
        //         }
        //     });
        //     res.redirect('/');
        // }
        // else
        // {
            res.render('index',{text : "Todo",newItem : x});
        // }
    });

});

app.post('/',function(req,res){
    let x=req.body.items;
    let y=req.body.submit;
    
    const insertItem=new Todolist({
        name:x
    });

    if(y==='Todo')
    {
        insertItem.save();
        res.redirect('/');
    }
    else
    {
        clist.findOne({name:y},function(err,addItemInList){
            addItemInList.clistItems.push(insertItem);
            addItemInList.save();
            res.redirect('/'+y);
        })
    }

});

app.post('/delete',function(req,res){
    const deleteItem=req.body.listItems;
    const delListItem=req.body.deleteListItem;

    if(delListItem==='Todo')
    {
        Todolist.findByIdAndDelete(deleteItem,function(err){
            if(!err)
            {
                console.log("Item deleted successfully from the list.");
            }
        });
        res.redirect('/');           
    }
    else
    {
        clist.findOneAndUpdate({name:delListItem},{$pull : {clistItems : {_id : deleteItem}}},function(err,x){
            if(!err)
            {
                res.redirect('/'+delListItem);
            }
        });
    }

});

const clistSchema=new mongoose.Schema({
    name:String,
    clistItems:[listSchema]
});

const clist=mongoose.model('Clist',clistSchema);

app.get("/:customList",function(req,res){
    const customList=_.capitalize(req.params.customList);

    clist.findOne({name:customList},function(err,x){
        // this will check in a set
        if(!err)
        {
            if(!x)
            {
                const clist1=new clist({
                    name:customList,
                    clistItems:arr
                });
            
                clist1.save();
                res.redirect('/' + customList);
            }
            else
            {
                res.render('index',{text:customList, newItem:x.clistItems});
            }
        }
    });
});


app.get('/about',function(req,res){
    res.render('about');
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
    console.log('server is running');
});