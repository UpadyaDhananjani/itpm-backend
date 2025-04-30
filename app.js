const express = require("express");
const mongoose = require("mongoose");

const router = require("./Routes/OrderRoutes");

const app = express();
const cors = require("cors");

//middleware 
app.use(express.json());
app.use(cors());
app.use("/orders",router);

  

mongoose.connect("mongodb+srv://admin:Upadya*25@cluster0.gleae.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=> {
    app.listen(5000);
}
)
.catch((err) => console.log((err)));


