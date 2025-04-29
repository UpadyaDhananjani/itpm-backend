import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://admin:Upadya*25@cluster0.gleae.mongodb.net/test0').then(()=>console.log("DB connected"))
}