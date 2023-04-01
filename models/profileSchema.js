const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    // user:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user'
    // },
    fullName:{
        type:String,
    },
    about:{
        type:String
    },
    collage:{
        type:String,
    },
    job:{
        type:String,
    },
    country:{
        type:String,
    },
    address:{
        type:String,
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    }
})

const Profile = new mongoose.model('Profile_detail',profileSchema);
module.exports = Profile;