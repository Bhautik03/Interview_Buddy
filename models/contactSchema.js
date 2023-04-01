const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        // unique:true,
    },
    subject:{
        type:String,
    },
    message:{
        type:String,
    }
})

const contact = new mongoose.model("con_infos",contactSchema);
module.exports = contact;