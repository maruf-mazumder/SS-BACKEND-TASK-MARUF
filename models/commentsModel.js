const mongoose = require("mongoose");
const Joi = require('joi')



const commentSchema = new mongoose.Schema({
   
    post:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Post'},
    commenter:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    description:String,
    date:{
        type:Date,
        default:Date.now
    }
});



const Comment =  mongoose.model('Comment',commentSchema);



const validateComment = function (user) {
    const schema = {
        post:Joi.objectId().required(),
        // commenter:Joi.objectId().required(),
        description:Joi.string().min(5).required(),
    }
    return Joi.validate(user,schema);
}

module.exports.Comment = Comment;
module.exports.validate = validateComment;