// routes/printerRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/printerController');
const { validatePrinter } = require('../middleware/validators');

// POST /printers – create a printer (validation middleware)
router.post('/', validatePrinter, controller.createPrinter);

// GET /printers – list all printers (optional filters)
router.get('/', controller.listPrinters);

// GET /printers/summary – summary of printers by material
router.get('/summary', controller.getSummary);

// GET /printers/:id – get a single printer
router.get('/:id', controller.getPrinter);

// PUT or PATCH /printers/:id – update printer
router.put('/:id', validatePrinter, controller.updatePrinter);
router.patch('/:id', controller.updatePrinter);

// DELETE /printers/:id – delete printer
router.delete('/:id', controller.deletePrinter);

module.exports = router;
