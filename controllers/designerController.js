// controllers/designerController.js
const db = require('../database/database');

async function createDesigner(req, res, next) {
    const { name, email } = req.body;
    try {
        const result = await db.run(
            `INSERT INTO designers (name, email) VALUES (?,?)`,
            [name, email]
        );
        const lastId = result.lastInsertRowid ?? result.lastID;
        const designer = await db.get('SELECT * FROM designers WHERE designer_id = ?', [lastId]);
        res.status(201).json({ message: 'Designer created successfully', designer });
    } catch (e) {
        if (e && e.code === 'SQLITE_CONSTRAINT' && e.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        next(e);
    }
}

async function listDesigners(req, res, next) {
    try {
        const designers = await db.all('SELECT * FROM designers ORDER BY designer_id');
        res.json(designers);
    } catch (e) {
        next(e);
    }
}

module.exports = { createDesigner, listDesigners };

