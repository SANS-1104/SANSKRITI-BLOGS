const express = require("express");
const app = express();
const port = 8080;
const path =require("path");
const { v4: uuidv4 } = require('uuid');
let methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));

const mysql= require("mysql2");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'quora_page',
    password : '1104'
  
});

// let q = "insert into posts (id,username,content) values ?";
// let users = [
//     [uuidv4(),"apnacollege","I love coding!!"],
//     [uuidv4(),"Nidhi","Hardwork is important to achieve success..."],
//     [uuidv4(),"Sanskriti","I got selected for my 1st internship :)"],
//     [uuidv4(),"Subodh","Exercise is one of the most important element of life.."],
//     [uuidv4(),"apnacollege","I love coding!!"],
//     [uuidv4(),"Nidhi","Hardwork is important to achieve success..."],
//     [uuidv4(),"Sanskriti","I got selected for my 1st internship :)"],
//     [uuidv4(),"Subodh","Exercise is one of the most important element of life.."]
// ];
// try{
//     connection.query(q,[users],(err,result) => {
//         if (err) throw err;
//         console.log(result);
//     });
// }catch(err){
//     console.log("OOPSSS.....SOMETHING WENT WRONG!!");
// }



app.listen(port,()=>{
    console.log(`App is listening to port no : ${port}`);
});

app.get("/posts",(req,res)=>{
    let q = "SELECT * FROM posts";
    try {
        connection.query(q, (err,posts) =>{
            if (err) res.send("kuch gadbad hui hai");
            // res.send(posts);
            res.render("index.ejs", { posts });
        });
    } catch (error) {
        console.log(error);
        res.send("Let's Check some error occured!!");
    }
    
});
app.get("/",(req,res)=>{
    let q = "SELECT * FROM posts";
    try {
        connection.query(q, (err,posts) =>{
            if (err) res.send("kuch gadbad hui hai");
            // res.send(posts);
            res.render("index.ejs", { posts });
        });
    } catch (error) {
        console.log(error);
        res.send("Let's Check some error occured!!");
    }
    
});

// GETTING TO THE NEWPOST PAGE

app.get("/posts/newPost",(req,res)=>{
    let q = "SELECT * FROM posts";
    try {
        connection.query(q, (err,posts) =>{
            if (err) res.send("kuch gadbad hui hai");
            res.render("newPost.ejs");
        });
    } catch (error) {
        console.log(error);
        res.send("Let's Check some error occured!!");
    }
    
    
});
 
// SUMITTING POST AFTER CREATING IT


app.post("/posts", (req,res) =>{
    let {username , content} = req.body;
    let q = "INSERT INTO posts (id,username,content) VALUES ?";
    let users = [
        [uuidv4(),username,content]
    ];
    try{
        connection.query(q,[users],(err,result) =>{
            if(err) throw err;
            console.log(result);
            res.redirect("/posts");
        });
    }catch(err){
        console.log(err);
    }
})

// SEE IN DETAIL OF THE POST

app.get("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let q = `select * from posts where id = '${id}'`;
    try{
        connection.query(q,(err,posts)=>{
            if(err) throw err;
            let post=posts[0];
            if(posts.some(post => post.id === id)){
                res.render("show.ejs",{post});
            }else{
                console.log("error page");
                res.render("error.ejs");
            }
        })
    }catch(err){
        console.log(err);
    }
    
});

// GETTING TO THE EDIT PAGE 

app.get("/posts/:id/edit",(req,res) =>{
    let {id} = req.params;
    // let post = posts.find((p) => id ===p.id);
    let q = `select * from posts where id = '${id}'`;
    
    try {
        connection.query(q,(err,posts) =>{
            if(err) throw err;
            let post = posts[0];
            console.log(post);
            res.render("edit.ejs", {post});
        })
    } catch (err) {
        console.log(err);
    }
    
});

// SUBMITTING AFTER EDITING THE POST


app.patch("/posts/:id", (req,res) => {
    let {id} = req.params;
    let newContent = req.body.content;
    let q = `UPDATE posts SET content = '${newContent}' WHERE id = '${id}'`;
    try{
        connection.query(q,(err,posts) =>{
            if (err) throw err;
            let post= posts[0];
            res.redirect("/posts");
        });
    }catch(err){
        console.log(err);
    }
});


// DELETING A POST

app.delete("/posts/:id", (req,res)=>{
    let {id} = req.params;
    let q = `DELETE FROM posts WHERE ID = '${id}'`;
    try{
        connection.query(q, (err,result) =>{
            if (err) throw err;
            res.redirect("/posts");
        })
    }catch(err){
        console.log(err);
    }
    // posts = posts.filter((p) => id !== p.id);
    
});

