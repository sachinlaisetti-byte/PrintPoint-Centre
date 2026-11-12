// controllers/printerController.js
const db = require('../database/database');

async function createPrinter(req, res, next) {
    const { name, material, status } = req.body;
    try {
        const result = await db.run(
            `INSERT INTO printers (name, material, status) VALUES (?,?,?)`,
            [name, material, status]
        );
        const lastId = result.lastInsertRowid ?? result.lastID;
        const printer = await db.get('SELECT * FROM printers WHERE printer_id = ?', [lastId]);
        res.status(201).json({ message: 'Printer created successfully', printer });
    } catch (e) {
        next(e);
    }
}

async function listPrinters(req, res, next) {
    const { material, status } = req.query;
    const conditions = [];
    const params = [];
    if (material) {
        conditions.push('material = ? COLLATE NOCASE');
        params.push(material);
    }
    if (status) {
        conditions.push('status = ? COLLATE NOCASE');
        params.push(status);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    try {
        const printers = await db.all(`SELECT * FROM printers ${where} ORDER BY printer_id`, params);
        res.json(printers);
    } catch (e) {
        next(e);
    }
}

async function getSummary(req, res, next) {
    try {
        const rows = await db.all(
            `SELECT material, COUNT(*) AS count FROM printers GROUP BY material ORDER BY material;`
        );
        res.json(rows);
    } catch (e) {
        next(e);
    }
}

async function getPrinter(req, res, next) {
    const { id } = req.params;
    try {
        const printer = await db.get('SELECT * FROM printers WHERE printer_id = ?', [id]);
        if (!printer) return res.status(404).json({ error: 'Printer not found.' });
        res.json(printer);
    } catch (e) {
        next(e);
    }
}

async function updatePrinter(req, res, next) {
    const { id } = req.params;
    const { name, material, status } = req.body;
    try {
        const existing = await db.get('SELECT * FROM printers WHERE printer_id = ?', [id]);
        if (!existing) return res.status(404).json({ error: 'Printer not found.' });
        await db.run(
            `UPDATE printers SET name = ?, material = ?, status = ? WHERE printer_id = ?`,
            [name ?? existing.name, material ?? existing.material, status ?? existing.status, id]
        );
        const printer = await db.get('SELECT * FROM printers WHERE printer_id = ?', [id]);
        res.json({ message: 'Printer updated successfully', printer });
    } catch (e) {
        next(e);
    }
}

async function deletePrinter(req, res, next) {
    const { id } = req.params;
    try {
        const result = await db.run('DELETE FROM printers WHERE printer_id = ?', [id]);
        if (result.changes === 0) return res.status(404).json({ error: 'Printer not found.' });
        res.status(204).send();
    } catch (e) {
        if (e.message && e.message.includes('FOREIGN KEY')) {
            return res.status(409).json({ error: 'Printer cannot be deleted because it has reservations.' });
        }
        next(e);
    }
}

module.exports = {
    createPrinter,
    listPrinters,
    getSummary,
    getPrinter,
    updatePrinter,
    deletePrinter,
};

