const express = require('express');
const router = express.Router();
const pool = require('./db');

// 建立新使用者
router.post('/users', async (req, res) => {
    try {
        const { name, nickname, age } = req.body;
        const result = await pool.query('INSERT INTO users (name, nickname, age) VALUES ($1, $2, $3) RETURNING id', [name, nickname, age]);
        const newUser = result.rows[0];
        res.status(201).json({ id: newUser.id });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
}); 

// 取得特定使用者資訊
router.get('/users/:id', async (req, res) => {
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

// 取得使用者清單
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        const users = result.rows;
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
});

// 刪除使用者
router.delete('/users/:id', async (req, res) => {
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

module.exports = router;