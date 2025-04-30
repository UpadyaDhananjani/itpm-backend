const express = require("express");
const router = express.Router();

// Correct imports
const UserController = require("../Controllers/UserController"); // Assuming your file is named UserController.js (singular)

// Routes
router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUsers); // Fixed case to match the exported function
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

// Export
module.exports = router;