const jwt =  require('jsonwebtoken');
const _ = require('lodash');
const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User} =  require('../models/userModel')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



router.post('/',async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send('Invalid Email or Password')

    const validPassword =  await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid Email or Password')


    const token =  user.generateAuthToken();
    res.send(token);

});


const validate = function (user) {
    const schema = {
        email:Joi.string().min(5).max(50).required().email(),
        password:Joi.string().min(5).max(1150).required(),
    }
    return Joi.validate(user,schema);
}

module.exports=router;


