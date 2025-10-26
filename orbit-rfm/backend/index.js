const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { Parser } = require('json2csv');

const app = express();
app.use(cors());
app.use(express.json());

// DB connection config
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',                    // Edit as needed for your system
    password: 'Botarun@123',         // Edit as needed for your system
    database: 'orbit_rfm'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL.');
});

app.get('/', (req, res) => res.send('Backend working!'));

app.get('/universities', (req, res) => {
    db.query('SELECT * FROM universities', (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// MATCH endpoint: calculates best-fit universities for given scores
app.post('/match', (req, res) => {
    const { gmat, gpa, workExp, targetProgram } = req.body;
    db.query('SELECT * FROM universities', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        let matched = results.map(u => {
            let score = 0;
            score += Math.max(0, gmat - u.min_gmat);
            score += Math.max(0, (gpa - u.min_gpa) * 100);
            score += (u.tier === 'Tier 1' ? 12 : u.tier === 'Tier 2' ? 8 : 5); // more weight for top tier
            score += (workExp ? Math.min(10, workExp) : 0); // bonus for work exp
            return {...u, matchScore: score};
        });
        matched.sort((a, b) => b.matchScore - a.matchScore);
        res.json(matched);
    });
});

// EXPORT to CSV endpoint
app.post('/export', (req, res) => {
    const results = req.body.results || [];
    try {
        const parser = new Parser();
        const csv = parser.parse(results);
        res.header('Content-Type', 'text/csv');
        res.attachment('universities.csv');
        return res.send(csv);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
