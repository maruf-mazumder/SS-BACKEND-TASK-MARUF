const config = require('config');
const mongoose =  require('mongoose');
const Joi = require('joi');
const users =  require('./routes/users');
const auth =  require('./routes/auth');
const posts =  require('./routes/posts');
const comments =  require('./routes/comments');
const express = require('express');
const app = express();



if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined.')
}

mongoose.connect('mongodb://localhost/sayburgBlog')
    .then(()=> console.log("Connected to mongodb..."))
    .catch(err =>console.error("Couldnot connect to mongodb...",err));



app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api/posts',posts);
app.use('/api/users',users);
app.use('/api/auth',auth);
app.use('/api/comments',comments);

// let posts =[
//     {id:1 ,name: "Post 1", comment:["Maruf"]},
//     {id:2 ,name: "Post 2", comment:[]},
//     {id:3 ,name: "Post 3", comment:[]},
// ]
// app.get('/',(req,res)=>{
//     res.send("Hello World..");
// });

// app.get("/api/posts",(req,res)=>{
//     res.send(posts);
// });

// app.get("/api/posts/:id",(req,res)=>{

    


//     let post =  posts.find(p => p.id===parseInt(req.params.id))
//     if(!post) return res.status(404).send("Course with the given id not found...")
//     if(req.params.id==1){
//         let  l = (post.comment.length)
//          post.comment.push("ddddd");
//          res.send(post)
//     }else{
//         res.send(post);
//     }
    
// });

// app.post('/api/posts',(req,res)=>{
//     const schema = {
//         name:Joi.string().min(3).required()
//     }

//     const result =  Joi.validate(req.body,schema);
//     if(result.error){
//         return res.status(400).send(result.error.details[0].message)
//     }


//     let aa = req.body.comment;
//     console.log(aa);
//     const post ={
//         id:posts.length+1,
//         name:req.body.name,
//         comment:[aa]
//     }
//     posts.push(post);
//     res.send(posts);
// })

// app.put('/api/posts/:id',(req,res)=>{
//     let post =  posts.find(p => p.id===parseInt(req.params.id))
//     if(!post) return res.status(404).send("Course with the given id not found...")
//     post.name=req.body.name;
//     res.send(post)
// })
// // app.get("/api/posts/:year/:month",(req,res)=>{
// //     res.send(req.query);
// // });

// app.delete("/api/posts/:id",(req,res)=>{
//     let post =  posts.find(p => p.id===parseInt(req.params.id))
//     if(!post) return res.status(404).send("Course with the given id not found...")

//     const index=posts.indexOf(post);
//     posts.splice(index,1);
//     res.send(post)
// });









// getPosts();
// createPost();
// updatePost("6044a49ba7467b14c81e7e29");
// deletePost("6044a49ba7467b14c81e7e29");


const port = process.env.PORT || 3200;
app.listen(port,()=>{console.log(`Listening on post.... ${port}`)});