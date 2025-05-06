const request = require('supertest');
const app = require('../app');
const pool = require('../database/db');

afterAll(() => pool.end());

describe('Freight API Endpoints', () => {

  describe('POST /api/freight/import', () => {
    test('should import valid freight data', async () => {
      const res = await request(app)
        .post('/api/freight/import')
        .send({
          rows: [
            {
              "From Port": "Shanghai",
              "To Port": "Los Angeles",
              "Date": "2024-05-06",
              "Carrier": "Maersk",
              "Rate": "2500"
            }
          ],
          mapping: {
            "From Port": "OriginCountry",
            "To Port": "DestinationCountry",
            "Date": "Date-time",
            "Carrier": "ShipperName",
            "Rate": "20'GP"
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test('should return 400 for missing body', async () => {
      const res = await request(app)
        .post('/api/freight/import')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should handle invalid date format gracefully', async () => {
      const res = await request(app)
        .post('/api/freight/import')
        .send({
          rows: [
            {
              "From Port": "Tokyo",
              "To Port": "Mumbai",
              "Date": "invalid-date",
              "Carrier": "MSC",
              "Rate": "1800"
            }
          ],
          mapping: {
            "From Port": "OriginCountry",
            "To Port": "DestinationCountry",
            "Date": "Date-time",
            "Carrier": "ShipperName",
            "Rate": "20'GP"
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].shipment_datetime).toBeNull();
    });
  });

  describe('GET /api/freight', () => {
    test('should return list of freight data sorted by created_at', async () => {
      const res = await request(app).get('/api/freight');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});