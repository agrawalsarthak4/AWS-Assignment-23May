const mongoose = require('mongoose');
const userSchema = new mongoose.Schema( {
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique :true
    },
	title:{
        type:String,
        enum:['Mr', 'Mrs', 'Miss']
    }, 
	email:{
        type:String,
        required:true,
        unique : true
    },
    password:{
        type:String,
        required:true
    },
    address: {
        street:{type:String},
        city:{type:String},
        pincode:{type:String}
    },
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema) 