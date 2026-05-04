const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // <---  Automatically hides password from queries
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // List of users following THIS user
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{ timestamps: true } // <--- Adds createdAt and updatedAt automatically

); 

userSchema.pre('save', async function() {
if (!this.isModified('password')) {
return;
}

const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(enteredPassword) {
return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);




