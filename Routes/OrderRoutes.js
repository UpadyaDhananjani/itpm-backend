const express = require("express");
const router = express.Router();
//insert model
const Order = require("../Models/OrderModel");
//insert order controller
const OrderController = require("../Controllers/OrderControllers");

router.get("/",OrderController.getAllOrders);
router.post("/",OrderController.addOrders);
router.get("/:id",OrderController.getById);
router.put("/:id",OrderController.updateOrder);
router.delete("/:id",OrderController.deleteOrder);
//export
module.exports = router;