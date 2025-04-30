const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name:{
        type:String,//dataType
        required:true,//validate
    },
    age:{
        type:Number,//dataType
        required:true,//validate
    },
    email:{
        type:String,//dataType
        required:true,//validate
    },
    phone:{
        type:Number,//dataType
        required:true,//validate
    },
    address:{
        type:String,//dataType
        required:true,//validate
    },
    healthIssues:{
        type:String,//dataType
        required:true,//validate
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User; 
  

