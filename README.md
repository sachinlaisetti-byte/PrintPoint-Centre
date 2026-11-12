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

## License
MIT © Group YG‑CSEDS2B‑G04
