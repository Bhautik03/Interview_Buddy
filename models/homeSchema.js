const mongoose = require('mongoose');
const userSchema =  new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    phoneno:{
        type:String
    }
})

const Register = new mongoose.model("Registerusers",userSchema);
module.exports = Register;