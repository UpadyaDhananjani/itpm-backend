const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enables CORS for all requests
app.use(express.json()); // Parses JSON request bodies

//  In-memory array to store users
let users = [];

mongoose.connect("mongodb+srv://admin:Upadya*25@cluster0.gleae.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB Error:", err));

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  phone: String,
  address: String,
  healthIssues: String,
});

const User = mongoose.model("User", UserSchema);


//  GET route to fetch all users
app.get("/users", async (req, res) => {
  try {
      const users = await User.find();
      res.json({ users });
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
});

//  POST route to add a new user
app.post("/users", async (req, res) => {
  try {
      console.log("Received Data:", req.body); // Debugging log
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  // Logic to delete the user from the database by ID
  User.findByIdAndUpdate(id)
    .then(() => res.status(200).send({ message: 'User updated successfully' }))
    .catch((error) => res.status(500).send({ error: 'Error updating user' }));
});



app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  // Logic to delete the user from the database by ID
  User.findByIdAndDelete(id)
    .then(() => res.status(200).send({ message: 'User deleted successfully' }))
    .catch((error) => res.status(500).send({ error: 'Error deleting user' }));
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
