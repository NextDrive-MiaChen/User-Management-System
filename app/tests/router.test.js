const request = require('supertest');
const pool = require('../config/db');
const router = require('../routes/router'); 

jest.mock('../config/db');
jest.useRealTimers();

describe('GET /users/:id', () => {
    it('should return a user when valid id is provided', async () => {
        
        const mockUser = { id: 1, name: 'Test User', age: 30 };
        pool.query.mockResolvedValue({ rows: [mockUser] });

        const response = await request(router).get('/users/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    it('should return 404 error when user is not found', async () => {
        
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(router).get('/users/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'User not found' });
    });

    it('should return 500 error when database query fails', async () => {
        
        pool.query.mockRejectedValue(new Error('Database query failed'));
      
        const response = await request(router).get('/users/1');
        console.log(response);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'An error occurred while fetching the user.' });
    });

    afterAll(() => {
        pool.end();
    });
});
