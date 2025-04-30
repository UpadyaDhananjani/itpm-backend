const Menu = require("../Model/MenuModel");

const validateMenuData = (name, description, originalPrice, currentPrice, category) => {
  const errors = {};
  if (!name || !name.trim()) errors.name = "Name is required";
  if (!description || !description.trim()) errors.description = "Description is required";

  if (!originalPrice && originalPrice !== 0) {
    errors.originalPrice = "Original price is required";
  } else {
    const priceNum = Number(originalPrice);
    if (isNaN(priceNum)) errors.originalPrice = "Original price must be a number";
    else if (priceNum <= 0) errors.originalPrice = "Original price must be greater than 0";
  }

  if (!currentPrice && currentPrice !== 0) {
    errors.currentPrice = "Current price is required";
  } else {
    const priceNum = Number(currentPrice);
    if (isNaN(priceNum)) errors.currentPrice = "Current price must be a number";
    else if (priceNum <= 0) errors.currentPrice = "Current price must be greater than 0";
    else if (priceNum > Number(originalPrice)) errors.currentPrice = "Current price cannot be higher than original price";
  }

  const validCategories = ['pizza', 'burger', 'juice', 'pasta', 'healthy food', 'all'];
  if (!category || !validCategories.includes(category)) {
    errors.category = "Valid category is required (pizza, burger, juice, pasta, healthy food, all)";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

const getAllMenus = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'all' ? { category } : {};
    const menus = await Menu.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: menus });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch menus", error: err.message });
  }
};

const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ success: false, message: "Menu not found" });
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    const status = err.kind === 'ObjectId' ? 400 : 500;
    const message = err.kind === 'ObjectId' ? "Invalid menu ID format" : "Failed to fetch menu";
    res.status(status).json({ success: false, message, error: err.message });
  }
};

const addMenu = async (req, res) => {
  try {
    let { name, description, originalPrice, currentPrice, category } = req.body;
    name = name?.trim();
    description = description?.trim();
    originalPrice = parseFloat(originalPrice);
    currentPrice = parseFloat(currentPrice);
    category = category?.toLowerCase();

    const { isValid, errors } = validateMenuData(name, description, originalPrice, currentPrice, category);
    if (!isValid) return res.status(400).json({ success: false, message: "Validation failed", errors });

    const isOnSale = currentPrice < originalPrice;
    const newMenu = new Menu({ name, description, originalPrice, currentPrice, category, isOnSale });
    await newMenu.save();

    res.status(201).json({ success: true, data: newMenu });
  } catch (err) {
    console.error("Error during menu creation:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateMenu = async (req, res) => {
  try {
    let { name, description, originalPrice, currentPrice, category } = req.body;
    name = name?.trim();
    description = description?.trim();
    originalPrice = parseFloat(originalPrice);
    currentPrice = parseFloat(currentPrice);
    category = category?.toLowerCase();

    const { isValid, errors } = validateMenuData(name, description, originalPrice, currentPrice, category);
    if (!isValid) return res.status(400).json({ success: false, message: "Validation failed", errors });

    const existing = await Menu.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Menu not found" });

    const isOnSale = currentPrice < originalPrice;
    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, description, originalPrice, currentPrice, category, isOnSale },
      { new: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Menu not found" });

    res.status(200).json({ success: true, message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  addMenu,
  updateMenu,
  deleteMenu
};
