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

beforeEach(() => {
    pool.query = mockQuery;
});

app.use('/', router);

describe('POST /users', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should create a new user', async () => {
        const newUser = { name: 'Test User', nickname: 'testuser', age: 25 };
        const userId = 123;

        mockQuery.mockResolvedValue({ rows: [{ id: userId }] });

        const response = await request(app)
            .post('/users')
            .set('Authorization', 'Bearer valid_token')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: userId });
        expect(authJwt.verifyToken).toHaveBeenCalled();
    });

    it('should return 500 error when database query fails', async () => {
        const newUser = { name: 'Test User', nickname: 'testuser', age: 25 };

        mockQuery.mockRejectedValue(new Error('Database query failed'));

        const response = await request(app)
            .post('/users')
            .set('Authorization', 'Bearer valid_token')
            .send(newUser);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'An error occurred while creating the user.' });
        expect(authJwt.verifyToken).toHaveBeenCalled();
    });
});
