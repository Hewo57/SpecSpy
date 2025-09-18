const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// Dummy API endpoint for now
const GSM_API_URL = "https://script.google.com/macros/s/AKfycbxNu27V2Y2LuKUIQMK8lX1y0joB6YmG6hUwB1fNeVbgzEh22TcDGrOak03Fk3uBHmz-/exec";

// Endpoint to search phone by keyword
app.post('/api/search', async (req, res) => {
    const { keyword } = req.body;

    if (!keyword) return res.status(400).json({ error: 'No keyword provided' });

    try {
        // Call the GSMArena API
        const response = await fetch(GSM_API_URL + '?route=search-by-keywords', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords: keyword })
        });

        const data = await response.json();
        res.json(data); // send data to frontend
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch data from GSMArena API' });
    }
});

// Endpoint to get device details by ID
app.post('/api/device', async (req, res) => {
    const { device_id } = req.body;

    if (!device_id) return res.status(400).json({ error: 'No device_id provided' });

    try {
        const response = await fetch(GSM_API_URL + '?route=device-detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id })
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch device details' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
