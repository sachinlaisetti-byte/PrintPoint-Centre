// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');
const { validateReservation } = require('../middleware/validators');

// POST /reservations – create a reservation (validation middleware)
router.post('/', validateReservation, controller.createReservation);

// GET /reservations and /reservations/details – list reservation details
router.get('/', controller.listReservationDetails);
router.get('/details', controller.listReservationDetails);

module.exports = router;
