// tests/api.test.js
// Jest + Supertest integration tests for PrintPoint‑Centre API

const request = require('supertest');
const { execSync } = require('child_process');
const app = require('../server'); // Express app exported from server.js

// Ensure a clean DB before the whole suite runs
beforeAll(() => {
  // Reset and seed the database using the project's npm scripts
  execSync('npm run reset', { stdio: 'ignore' });
  execSync('npm run seed', { stdio: 'ignore' });
});

describe('Designers API', () => {
  test('GET /designers returns seeded designers', async () => {
    const res = await request(app).get('/designers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // The seed creates three designers (Alice, Bob, Carol)
    const names = res.body.map(d => d.name);
    expect(names).toEqual(expect.arrayContaining(['Alice', 'Bob', 'Carol']));
  });

  test('POST /designers creates a new designer', async () => {
    const newDesigner = { name: 'Dave', email: 'dave@example.com' };
    const postRes = await request(app).post('/designers').send(newDesigner);
    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.designer).toMatchObject(newDesigner);

    // Verify it appears in the list
    const listRes = await request(app).get('/designers');
    const emails = listRes.body.map(d => d.email);
    expect(emails).toContain('dave@example.com');
  });
});

describe('Printers API', () => {
  test('GET /printers returns seeded printers', async () => {
    const res = await request(app).get('/printers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Seed includes six printers
    expect(res.body.length).toBeGreaterThanOrEqual(6);
  });

  test('POST /printers creates a printer and can be fetched', async () => {
    const printer = { name: 'TestPrinter', material: 'PLA', status: 'available' };
    const createRes = await request(app).post('/printers').send(printer);
    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.printer).toMatchObject(printer);
    const id = createRes.body.printer.printer_id;

    const getRes = await request(app).get(`/printers/${id}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toMatchObject(printer);
  });

  test('GET /printers/summary returns material counts', async () => {
    const res = await request(app).get('/printers/summary');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Each entry should have material and count fields
    for (const row of res.body) {
      expect(row).toHaveProperty('material');
      expect(row).toHaveProperty('count');
    }
  });
});

describe('Reservations API', () => {
  test('POST /reservations creates a reservation when printer is available', async () => {
    const reservation = {
      designer_id: 1, // Alice from seed data
      printer_id: 1, // Printer A (available) from seed data
      reservation_date: '2026-12-20',
    };
    const res = await request(app).post('/reservations').send(reservation);
    expect(res.statusCode).toBe(201);
    expect(res.body.reservation).toMatchObject(reservation);

    // Verify printer status changed to "reserved"
    const printerRes = await request(app).get(`/printers/${reservation.printer_id}`);
    expect(printerRes.statusCode).toBe(200);
    expect(printerRes.body.status).toBe('reserved');
  });

  test('GET /reservations returns reservation details', async () => {
    const res = await request(app).get('/reservations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // At least one reservation should exist after previous test
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    const first = res.body[0];
    expect(first).toHaveProperty('reservation_id');
    expect(first).toHaveProperty('designer_name');
    expect(first).toHaveProperty('printer_name');
    expect(first).toHaveProperty('reservation_date');
  });
});
