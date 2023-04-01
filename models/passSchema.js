const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    password:{
        type:String
    },
    newpassword:{
        type:String
    },
    renewpassword:{
        type:String
    }
})

const pass = new mongoose.model("pass_info",passSchema);
module.exports = pass;