const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    
    firstName:{
        type:String,//dataType
        required:true,//validate
    },
    lastName:{
        type:String,//dataType
        required:true,//validate
    },
    email:{
        type:String,//dataType
        required:true,//validate
    },
    phoneNumber:{
        type:String,//dataType
        required:true,//validate
    },
    address:{
        type:String,//dataType
        required:true,//validate
    },
    city:{
        type:String,//dataType
        required:true,//validate
    },
    orderId:{
        type:String,//dataType
        required:true,//validate
    },
    specialInstructions:{
        type:String,//dataType
        required:true,//validate
    },
    pickupTime:{
        type:String,//dataType
        required:true,//validate
    },
   orderStatus:{
        type:String,//dataType
        required:true,//validate
    }
    
        
    }
);

module.exports = mongoose.model(
    "OrderModel",//file name
    orderSchema //function name
)