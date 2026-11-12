-- designers table
CREATE TABLE IF NOT EXISTS designers (
    designer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- printers table
CREATE TABLE IF NOT EXISTS printers (
    printer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    material TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available','reserved','maintenance'))
);

-- reservations table
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    designer_id INTEGER NOT NULL,
    printer_id INTEGER NOT NULL,
    reservation_date TEXT NOT NULL,
    FOREIGN KEY (designer_id) REFERENCES designers (designer_id) ON DELETE CASCADE,
    FOREIGN KEY (printer_id)   REFERENCES printers   (printer_id)   ON DELETE CASCADE
);

