const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all stations
app.get('/api/stations', async (req, res) => {
    try {
        const stations = await prisma.station.findMany();
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stations' });
    }
});

// Get all connections
app.get('/api/connections', async (req, res) => {
    try {
        const connections = await prisma.connection.findMany({
            include: {
                fromStation: true,
                toStation: true,
            },
        });
        res.json(connections);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch connections' });
    }
});

// Add search history
app.post('/api/history', async (req, res) => {
    const { source, destination } = req.body;
    try {
        const history = await prisma.searchHistory.create({
            data: { source, destination },
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save search history' });
    }
});

// Get search history
app.get('/api/history', async (req, res) => {
    try {
        const history = await prisma.searchHistory.findMany({
            orderBy: { timestamp: 'desc' },
            take: 10,
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch search history' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
