const auth= require('../middleware/auth')
const admin= require('../middleware/admin')
const {Post,validate} =  require('../models/postModel')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.post('/',[auth,admin],async (req,res)=>{
  
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    let temp = req.body.tags
    let arr = [];

 let post = new Post({
     title:req.body.title,
     author:req.user._id,
     description:req.body.description,
     tags:arr.push(temp)
 });
    try{
        post = await post.save();
        res.send(post);
    }
    catch(ex){
        console.log(ex.message);
    }
});
router.put('/:id',[auth,admin],async (req,res)=>{

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);



    let temp = req.body.tags
    console.log("-->",temp);

    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).send('Couldnt find the post with the given id')
   
    if(post.author!==req.user._id){
        return res.status(401).send("Access denied.Invalid request")
    }
    post.title=req.body.title,
    post.author=req.body.author,
    post.description= req.body.description,
    post.tags.push(temp)


    res.send(post);
});

router.get('/',async(req,res)=>{
    const posts = await Post.find().select('title').populate('author','name').sort('name')
    res.send(posts);
})
router.get('/:id',async(req,res)=>{
    const post = await Post.findById(req.params.id)
    if(!post) return res.status(404).send('The post with the given id was not found')

    res.send(post);
});
router.delete('/:id',[auth,admin],async(req,res)=>{
    const post = await Post.findByIdAndRemove(req.params.id)
    if(!post) return res.status(404).send('The post with the given id was not found')
    res.send(post);
});


module.exports=router;