// server.js
const express = require('express');
const app = express();
const db = require('./database/database');
const designerRouter = require('./routes/designerRoutes');
const printerRouter = require('./routes/printerRoutes');
const reservationRouter = require('./routes/reservationRoutes');
const errorHandler = require('./middleware/errorHandler');

// Enable CORS for browser dashboard
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json());

// Live SQLite Query Runner Endpoint for Dashboard
app.post('/api/query', async (req, res, next) => {
    const { sql, params = [] } = req.body;
    if (!sql || typeof sql !== 'string') {
        return res.status(400).json({ error: 'SQL query string is required' });
    }
    const cleanSql = sql.trim();
    try {
        if (/^(SELECT|PRAGMA)/i.test(cleanSql)) {
            const rows = await db.all(cleanSql, params);
            res.json({ success: true, type: 'SELECT', rowCount: rows.length, data: rows });
        } else {
            const result = await db.run(cleanSql, params);
            res.json({ success: true, type: 'MUTATION', changes: result.changes, lastInsertRowid: result.lastInsertRowid });
        }
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
});

app.use('/designers', designerRouter);
app.use('/printers', printerRouter);
app.use('/reservations', reservationRouter);

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = app;
