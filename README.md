# PrintPoint‑Centre

A lightweight Express API for managing **designers**, **printers**, and **reservations** in a 3‑D‑printing centre.

## Features
- CRUD for designers and printers.
- Validation middleware for request payloads.
- SQLite database (file‑based) – schema is loaded automatically on startup.
- Transaction‑safe reservation creation (checks designer & printer existence, printer availability, duplicate reservations).
- Summary endpoint that reports how many printers exist per material.
- Simple seed/reset scripts for quick local testing.
- Full test suite using **Jest** and **Supertest**.

## Prerequisites
- Node 22 (or any recent LTS that supports ES2022).  
- No native build tools are required – the project uses **`better-sqlite3`**, a pure‑JavaScript SQLite driver.

## Setup & Run
```powershell
# Clone / copy the repo
cd "C:\BEF GA\PrintPoint-Centre"

# Install dependencies
npm install

# Reset the DB (clears any existing data)
npm run reset

# Seed with sample data
npm run seed

# Start the server (listens on port 3000 by default)
npm start
```
The server will print:
```
Server listening on port 3000
```
You can now hit the API, e.g.:
```powershell
curl http://localhost:3000/designers
```

## API Overview
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/designers` | Create a designer (requires `name` and `email`). |
| `GET`  | `/designers` | List all designers. |
| `POST` | `/printers` | Create a printer (requires `name`, `material`, `status`). |
| `GET`  | `/printers` | List printers – optional `?material=` and `?status=` filters. |
| `GET`  | `/printers/summary` | Material‑wise printer count. |
| `GET`  | `/printers/:id` | Get a single printer. |
| `PATCH`| `/printers/:id` | Update a printer. |
| `DELETE`| `/printers/:id`| Delete a printer (fails if it has reservations). |
| `POST` | `/reservations` | Create a reservation (validates designer, printer, availability, duplicate date). |
| `GET`  | `/reservations` | List reservation details (joins designers & printers). |

## Testing
The project ships with a Jest + Supertest suite.
```powershell
npm test
```
The tests reset & seed a temporary SQLite file, start the server on port 4000, run a series of endpoint checks, then clean up.

## Docker
A minimal Dockerfile is provided for containerised execution.
```bash
# Build the image
docker build -t printpoint-centre .

# Run the container (exposes port 3000)
docker run -p 3000:3000 printpoint-centre
```
The container will automatically seed the database on first start.

## Team Members & Work Division (Group YG-CSEDS2B-G04)

| Member # | Name | Role & Assigned Part | Key Contributions & Files |
|---|---|---|---|
| **Member 1** | **Preetham** | Server & Routes Setup | Express app initialization, server configuration (`server.js`, `package.json`), CORS setup, central error handling. |
| **Member 2** | **Navadeep** | Database & Relationships | SQLite schema design, 3 related tables with constraints, foreign keys, and seed script (`database/schema.sql`, `database/database.js`, `database/seed.js`). |
| **Member 3** | **Sobhan** | REST Endpoints (CRUD) | Printer CRUD operations (`POST`, `GET`, `PUT`, `DELETE`), parameter queries (`controllers/printerController.js`, `routes/printerRoutes.js`). |
| **Member 4** | **Jashwanth** (`trjashwanth24-cpu`) | Validation & Search | Input validation middleware, error messages, HTTP status codes, and search by query parameter (`middleware/validators.js`). |
| **Member 5** | **Karthik** | Twist Rule (Summary by Material) | Implementation of `GET /printers/summary` using SQL `GROUP BY` and `COUNT(*)`, passing all 3 twist tests. |
| **Member 6** | **Sachin** (`sachinlaisetti-byte`) | Postman, README & Integration | Complete Postman collection export, comprehensive documentation, interactive verification dashboard (`output.html`), and Git integration. |

## License
MIT © Group YG‑CSEDS2B‑G04
