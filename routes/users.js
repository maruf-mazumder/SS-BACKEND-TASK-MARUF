const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const {User, validate} =  require('../models/userModel')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();




router.get('/',async (req,res)=>{
    const users = await User.find().sort('name');
    res.send(users); 
});
router.get('/me',auth,async (req,res)=>{
    const user = await User.findById(req.user._id);
    if(!user) return res.status(404).send('The customer with the given id was not found');
    res.send(_.pick(user, ['_id','name', 'email','phone','isAdmin'])); 
});

router.post('/',[auth,admin],async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email})
    if(user) return res.status(400).send('User already registered')

     user = new User({
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            password:req.body.password,
            isAdmin:req.body.isAdmin,
            
        });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password,salt);
    user.password = hashedPassword;
    
    try {
        user = await user.save();
        let token = user.generateAuthToken()
        res.header('x-auth-token',token).send(_.pick(user, ['_id','name', 'email','phone','isAdmin'])) 
    }
     catch (ex) {
        console.log(ex.message)
    }
});

router.put('/:id',[auth,admin],async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    if(req.user._id!==req.params.id){
        return res.status(401).send("Access denied.Invalid request")
    }
     let user = await User.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            password:req.body.password,
            isAdmin:req.body.isAdmin,
        }
    },{new : true});

    if(!user) return res.status(404).send('The customer with the given id was not found');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password,salt);
    user.password = hashedPassword;

    try {
        user = await user.save();
        res.send(_.pick(user, ['_id','name', 'email','phone','isAdmin'])) 
    }
     catch (ex) {
        console.log(ex.message)
    }
});


router.delete('/:id',[auth,admin],async (req,res)=>{
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send('The customer with the given id was not found');

    res.send(user); 
});




module.exports=router;


