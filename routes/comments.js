const {Comment,validate} =  require('../models/commentsModel')
const auth= require('../middleware/auth')
const admin= require('../middleware/admin')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.post('/',auth,async (req,res)=>{

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

 let comment = new Comment({
     post:req.body.post,
     commenter:req.user._id,
     description:req.body.description,
 });
    try{
        comment = await comment.save();
        res.send(comment);
    }
    catch(ex){
        console.log(ex.message);
    }
});


router.put('/:id',[auth,admin],async (req,res)=>{

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
    let comment = await Comment.findById(req.params.id);
    if(!comment) return res.status(404).send('Couldnt find the post with the given id')
   
    comment.post=req.body.post,
    // comment.commenter=req.body.commenter,
    comment.description= req.body.description

    try{
        comment = await comment.save();
        res.send(comment);
    }
    catch(ex){
        console.log(ex.message);
    }
});


router.get('/:id',auth,async (req,res)=>{
 
    const comment = await Comment.findById(req.params.id);
    if(!comment) return res.status(404).send('Couldnt find the post with the given id')

    res.send(comment);
});

router.get('/',async (req,res)=>{
 
    const comment = await Comment.find().populate('commenter','name').sort('-date');

    if(!comment) return res.status(404).send('Couldnt find the post with the given id')

    res.send(comment);
});


router.delete('/:id',[auth,admin],async (req,res)=>{
 
    const comment = await Comment.findByIdAndRemove(req.params.id);
    if(!comment) return res.status(404).send('Couldnt find the post with the given id')

    res.send(comment);
});


module.exports=router;