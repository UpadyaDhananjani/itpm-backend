const express = require('express');
const router = express.Router();
const menuController = require('../Controllers/MenuControllers');

// Routes for menu operations
router.get('/', menuController.getAllMenus); // Get all menus
router.get('/:id', menuController.getMenuById); // Get menu by ID
router.post('/', menuController.addMenu); // Add new menu
router.put('/:id', menuController.updateMenu); // Update menu by ID
router.delete('/:id', menuController.deleteMenu); // Delete menu by ID

module.exports = router;
