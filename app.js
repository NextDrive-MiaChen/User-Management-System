const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let users = [];

let engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.json());


app.get('/', (req, res) => {
    res.render('index');
});

// 建立新使用者
app.post('/users', (req, res) => {
    const { name, nickname, age } = req.body;
    const newUser = { id: users.length+1, name, nickname, age };
    users.push(newUser);
    res.status(201).json( {id: newUser.id });
});

// 取得特定使用者資訊
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id === parseInt(id));
    if (!user) {
        res.status(404).json({ message: 'User not found' });
    } else {
        res.json(user);
    }
});

// 取得使用者清單
app.get('/users', (req, res) => {
    res.json(users);
});

// 刪除使用者
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index === -1) {
        res.status(404).json({ message: 'User not found' });
    } else {
        users.splice(index, 1);
        res.json({ message: 'User deleted successfully' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});