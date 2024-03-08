const express = require('express');
const app = express();
const router = require('./app/routes/router');

require('dotenv').config();

app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
})