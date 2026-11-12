// database/database.js
// Switched to better‑sqlite3 (pure‑JS, no native build required)
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '..', 'printpoint.db');
// Open database synchronously
const db = new Database(DB_PATH);
// Enable foreign key enforcement
db.pragma('foreign_keys = ON');
// Load schema (executed synchronously)
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
try {
    db.exec(schema);
} catch (e) {
    console.error('Schema load error:', e);
}

// Helper wrappers to keep the existing async API used by controllers
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        try {
            const stmt = db.prepare(sql);
            const info = stmt.run(...params);
            resolve(info);
        } catch (err) {
            reject(err);
        }
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        try {
            const stmt = db.prepare(sql);
            const row = stmt.get(...params);
            resolve(row);
        } catch (err) {
            reject(err);
        }
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        try {
            const stmt = db.prepare(sql);
            const rows = stmt.all(...params);
            resolve(rows);
        } catch (err) {
            reject(err);
        }
    });
}

async function transaction(callback) {
    // better‑sqlite3 provides a built‑in transaction helper
    const txn = db.transaction(callback);
    try {
        const result = txn();
        return result;
    } catch (e) {
        // The transaction will automatically roll back on error
        throw e;
    }
}

module.exports = { run, get, all, transaction, db };

