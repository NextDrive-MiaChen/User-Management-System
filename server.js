const express = require('express');
const app = express();
const router = require('./router');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
})