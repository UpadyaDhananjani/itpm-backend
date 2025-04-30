const express = require('express');
const router = express.Router();
const menuController = require('../Controllers/MenuControllers');

// Get all menus
router.get('/', menuController.getAllMenus);

// Get single menu by ID
router.get('/:id', menuController.getMenuById);

// Create new menu
router.post('/', menuController.addMenu);

// Update menu
router.put('/:id', menuController.updateMenu);

// Delete menu
router.delete('/:id', menuController.deleteMenu);

module.exports = router;
