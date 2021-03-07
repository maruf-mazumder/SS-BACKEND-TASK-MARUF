const mongoose = require("mongoose");
const Joi = require('joi')

Joi.objectId= require('joi-objectid')(Joi);


const postSchema = new mongoose.Schema({
    title:{
        type:String,
        maxlength:50
    },
    author:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    description:String,
    tags:[String],
    date:{
        type:Date,
        default:Date.now
    }
});

const BlogPost =  mongoose.model('BlogPost',postSchema);

const validatePost = function (user) {
    const schema = {
        title:Joi.string().min(5).max(50).required(),
        description:Joi.string().min(5).max(3350).required(),
        // author:Joi.objectId().required(),
        isAdmin:Joi.boolean()
    }
    return Joi.validate(user,schema);
}


module.exports.Post = BlogPost;
module.exports.validate = validatePost;