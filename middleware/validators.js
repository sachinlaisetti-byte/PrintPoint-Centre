// middleware/validators.js
function validateIdParam(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid ID.' });
    }
    req.params.id = id;
    next();
}

function validatePrinter(req, res, next) {
    const { name, material, status } = req.body;
    const errors = [];
    if (!name || typeof name !== 'string' || !name.trim()) {
        errors.push('Printer name is required.');
    } else if (name.length > 100) {
        errors.push('Printer name must be ≤ 100 characters.');
    }
    if (!material || typeof material !== 'string' || !material.trim()) {
        errors.push('Material is required.');
    }
    if (!status || typeof status !== 'string') {
        req.body.status = 'available';
    } else if (!['available', 'reserved', 'maintenance'].includes(status.trim())) {
        errors.push('Status must be one of available, reserved, maintenance.');
    }
    if (errors.length) {
        return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    // Normalise
    req.body.name = name.trim();
    req.body.material = material.trim();
    req.body.status = (status && typeof status === 'string' && status.trim()) ? status.trim().toLowerCase() : 'available';
    next();
}

function validateDesigner(req, res, next) {
    const { name, email } = req.body;
    const errors = [];
    if (!name || typeof name !== 'string' || !name.trim()) {
        errors.push('Designer name is required.');
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
        errors.push('Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.push('Email format is invalid.');
    }
    if (errors.length) {
        return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    req.body.name = name.trim();
    req.body.email = email.trim();
    next();
}

function validateReservation(req, res, next) {
    const { designer_id, printer_id, reservation_date } = req.body;
    const errors = [];
    if (!Number.isInteger(designer_id) || designer_id <= 0) {
        errors.push('designer_id must be a positive integer.');
    }
    if (!Number.isInteger(printer_id) || printer_id <= 0) {
        errors.push('printer_id must be a positive integer.');
    }
    if (!reservation_date || isNaN(Date.parse(reservation_date))) {
        errors.push('reservation_date must be a valid date.');
    }
    if (errors.length) {
        return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    next();
}

module.exports = {
    validateIdParam,
    validatePrinter,
    validateDesigner,
    validateReservation,
};

