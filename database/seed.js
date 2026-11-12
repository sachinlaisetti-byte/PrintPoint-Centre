// database/seed.js
const { run, db } = require('./database');
const args = process.argv.slice(2);

async function seed() {
    // Designers
    await run(`INSERT INTO designers (name, email) VALUES
        ('Alice','alice@example.com'),
        ('Bob','bob@example.com'),
        ('Carol','carol@example.com');`);
    // Printers
    await run(`INSERT INTO printers (name, material, status) VALUES
        ('Printer A','PLA','available'),
        ('Printer B','PLA','available'),
        ('Printer C','ABS','available'),
        ('Printer D','ABS','maintenance'),
        ('Printer E','PETG','available'),
        ('Printer F','PETG','available');`);
    // Reservations
    await run(`INSERT INTO reservations (designer_id, printer_id, reservation_date) VALUES
        (1,1,'2026-12-01'),
        (2,3,'2026-12-02');`);
    console.log('Seed data inserted.');
}

async function reset() {
    const tables = ['reservations', 'printers', 'designers'];
    for (const t of tables) {
        await run(`DELETE FROM ${t};`);
    }
    // Reset autoincrement counters
    await run('DELETE FROM sqlite_sequence;');
    console.log('Database reset (all tables cleared).');
}

(async () => {
    if (args[0] === 'reset') {
        await reset();
    } else {
        await seed();
    }
    db.close();
})();

