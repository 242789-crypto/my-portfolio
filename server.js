const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Endpoint to get all content
app.get('/api/content', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to update content
app.post('/api/content', (req, res) => {
    const newContent = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newContent, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.json({ message: 'Content updated successfully' });
    });
});

// Simple authentication (can be upgraded)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'waleed123') {
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
});
