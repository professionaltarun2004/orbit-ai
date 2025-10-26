const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// DB connection config
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',                    // Just 'root', NOT 'root@localhost'
    password: 'Botarun@123',         // Your MySQL password
    database: 'orbit_rfm'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL.');
});

// Root endpoint
app.get('/', (req, res) => res.send('Backend working!'));

// Get all universities as JSON
app.get('/universities', (req, res) => {
    db.query('SELECT * FROM universities', (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
});

// MATCH endpoint (POST): receives {gmat, gpa, workExp, targetProgram}
app.post('/match', (req, res) => {
    const { gmat, gpa, workExp, targetProgram } = req.body;

    db.query('SELECT * FROM universities', (err, results) => {
        if (err) return res.status(500).json({ error: err });

        // Basic matching logic: match score = sum of how well candidate matches each criterion
        let matched = results.map(u => {
            let score = 0;
            score += Math.max(0, gmat - u.min_gmat);  // +ve diff
            score += Math.max(0, (gpa - u.min_gpa) * 100); // scale for gpa
            score += (u.tier === 'Tier 1' ? 10 : u.tier === 'Tier 2' ? 7 : 4); // simulated preference for tier
            // Add more factors if you want!
            return {...u, matchScore: score};
        });
        // Sort descending by score
        matched.sort((a, b) => b.matchScore - a.matchScore);
        res.json(matched);
    });
});

// Add more endpoints below this line as you build

app.listen(5000, () => console.log('Server running on port 5000'));
