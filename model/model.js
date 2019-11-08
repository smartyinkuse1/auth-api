const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        min:5
    },
    username:{
        type: String,
        required:true,
        min:5
    },
    password:{
        type: String,
        required:true,
        min:4
    },
    date:{
        type:Date,
        default: Date.now
    },
    role:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);