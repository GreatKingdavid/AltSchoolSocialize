const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs')

const userSchema = new 
mongoose.Schema({
    first_name:{
        type: String,
        required: true,
        trim:true
    },
    last_name: {
        type: String,
        required: true,
        trim:true
    },
    username: {
        type: String,
        required: true,
        trim:true,
        unique:true
    },
    email:{
        type: String,
        required: true,
        trim:true,
        unique:true,
        lowercase:true,
    },
    password



})