// routes/designerRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/designerController');
const { validateDesigner } = require('../middleware/validators');

// POST /designers – create a designer (validation middleware)
router.post('/', validateDesigner, controller.createDesigner);

// GET /designers – list all designers
router.get('/', controller.listDesigners);

module.exports = router;
