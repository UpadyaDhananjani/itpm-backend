const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['pizza', 'burger', 'juice', 'pasta', 'healthy food', 'all'],
    default: 'all'
  },
  isOnSale: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Menu", MenuSchema);
