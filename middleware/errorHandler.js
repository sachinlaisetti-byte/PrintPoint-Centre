// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    // Log detailed error server‑side only
    console.error(err);

    // SQLite constraint handling
    if (err && err.code === 'SQLITE_CONSTRAINT') {
        if (err.message && err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: err.message });
        }
        if (err.message && err.message.includes('FOREIGN KEY')) {
            // treat as bad request
            return res.status(400).json({ error: err.message });
        }
    }

    // Default: internal server error
    res.status(500).json({ error: 'An unexpected error occurred.' });
}

module.exports = errorHandler;

