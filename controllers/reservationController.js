// controllers/reservationController.js
const db = require('../database/database');

async function createReservation(req, res, next) {
    const { designer_id, printer_id, reservation_date } = req.body;
    try {
        await db.transaction(async () => {
            // Verify designer exists
            const designer = await db.get('SELECT * FROM designers WHERE designer_id = ?', [designer_id]);
            if (!designer) {
                const err = new Error('Designer not found.');
                err.status = 404;
                throw err;
            }
            // Verify printer exists
            const printer = await db.get('SELECT * FROM printers WHERE printer_id = ?', [printer_id]);
            if (!printer) {
                const err = new Error('Printer not found.');
                err.status = 404;
                throw err;
            }
            // Must be available
            if (printer.status !== 'available') {
                const err = new Error('Printer is not available.');
                err.status = 409;
                throw err;
            }
            // Duplicate reservation for same printer+date?
            const dup = await db.get(
                'SELECT 1 FROM reservations WHERE printer_id = ? AND reservation_date = ?',
                [printer_id, reservation_date]
            );
            if (dup) {
                const err = new Error('Reservation already exists for this printer on the given date.');
                err.status = 409;
                throw err;
            }
            // Insert reservation
            const result = await db.run(
                'INSERT INTO reservations (designer_id, printer_id, reservation_date) VALUES (?,?,?)',
                [designer_id, printer_id, reservation_date]
            );
            // Update printer status to reserved
            await db.run('UPDATE printers SET status = "reserved" WHERE printer_id = ?', [printer_id]);
            const lastId = result.lastInsertRowid ?? result.lastID;
            const reservation = await db.get('SELECT * FROM reservations WHERE reservation_id = ?', [lastId]);
            res.status(201).json({ message: 'Reservation created successfully', reservation });
        });
    } catch (e) {
        if (e.status) {
            return res.status(e.status).json({ error: e.message });
        }
        next(e);
    }
}

async function listReservationDetails(req, res, next) {
    try {
        const rows = await db.all(
            `SELECT r.reservation_id,
                    d.name AS designer_name,
                    p.name AS printer_name,
                    r.reservation_date
               FROM reservations r
               JOIN designers d ON r.designer_id = d.designer_id
               JOIN printers p ON r.printer_id = p.printer_id
           ORDER BY r.reservation_date;`
        );
        res.json(rows);
    } catch (e) {
        next(e);
    }
}

module.exports = { createReservation, listReservationDetails };

