const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authJwt = require('../middleware/auth');
const { authenticateUser } = require('../middleware/auth');

// Create user
router.post('/users', authJwt.verifyToken, async (req, res) => {
    try {
        const { name, nickname, age } = req.body;
        const result = await pool.query('INSERT INTO users (name, nickname, age) VALUES ($1, $2, $3) RETURNING id', [name, nickname, age]);
        const newUser = result.rows[0];
        res.status(201).json({ id: newUser.id });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
}); 

// Get user info
router.get('/users/:id', authJwt.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
    
});

// Get user list
router.get('/users', authJwt.verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        const users = result.rows;
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
});

// Delete user
router.delete('/users/:id', authJwt.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }   
});

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const { usermail, password } = req.body;

        const userExists = await pool.query('SELECT * FROM auth WHERE usermail = $1', [usermail]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already registered'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO auth (usermail, password) VALUES ($1, $2)';
        await pool.query(query, [usermail, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
});

// Sign in
router.post('/signin', async (req, res) => {
    try {
        const { usermail, password } = req.body;
        const auth = await authenticateUser(usermail, password);
        if (!auth) {
            return res.status(401).json({ message: 'Invalid useremail or password' });
        }

        const accessToken = jwt.sign({ id: auth.id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        
        res.json({ id: auth.id, usermail: auth.usermail, accessToken: accessToken });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'An error occurred while signing in.' });
    }
});

module.exports = router;