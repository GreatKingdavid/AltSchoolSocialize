const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
title: {
    type: String,
required:[true, `A post must have a title`],
trim:true,
},
content:{
 type: String,
required:[true, `A post must have content`],
trim:true,
},

tags:[String],
author:{
    type: mongoose.Schema.Type.ObjectId,
    ref: 'User',
    required: true,
},
state:{
    type:String,
    enum: ['draft', 'published'],
    default: 'draft',
},
link_count:{
    type:Number,
    default:0,
},
likedBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
}],
comment_count: {
    type:Number,
    default: 0,
}
},
{
    timestamps: true
});


postSchema.index