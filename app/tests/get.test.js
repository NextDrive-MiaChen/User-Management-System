const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../config/db');
const router = require('../routes/router');
const authJwt = require('../middleware/auth');

const app = express();
app.use(bodyParser.json());

jest.mock('../middleware/auth', () => ({
    verifyToken: jest.fn().mockImplementation((req, res, next) => {

        req.user = { userId: 123 };
        next(); 
    }),
}));

const mockQuery = jest.fn();

app.use('/', router);

describe('GET /users', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should fetch users successfully', async () => {
        const mockUsers = [
            { id: 1, name: 'User 1', nickname: 'user1', age: 25 },
            { id: 2, name: 'User 2', nickname: 'user2', age: 30 }
        ];

        mockQuery.mockResolvedValue({ rows: mockUsers });

        pool.query = mockQuery;

        const response = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer valid_token');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
        expect(authJwt.verifyToken).toHaveBeenCalled();
    });

    it('should return 500 error when database query fails', async () => {
        mockQuery.mockRejectedValue(new Error('Database query failed'));

        pool.query = mockQuery;

        const response = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer valid_token'); 

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'An error occurred while fetching users.' });
        expect(authJwt.verifyToken).toHaveBeenCalled();
    });
});
