const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// SAVE RESUME
app.post('/api/resume', async (req, res) => {
  try {
    const { details, education, projects } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO resume_details
      (name, title, summary, phone, email, address, skills, languages, personality_traits)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        details.name,
        details.title,
        details.summary,
        details.phone,
        details.email,
        details.address,
        details.skills,
        details.languages,
        details.personality_traits
      ]
    );

    const resumeId = result.insertId;

    for (const edu of education) {
      await pool.execute(
        `INSERT INTO education (resume_id, degree, institute, year, score)
         VALUES (?, ?, ?, ?, ?)`,
        [resumeId, edu.degree, edu.institute, edu.year, edu.score]
      );
    }

    for (const proj of projects) {
      await pool.execute(
        `INSERT INTO projects (resume_id, title, description)
         VALUES (?, ?, ?)`,
        [resumeId, proj.title, proj.description]
      );
    }

    res.json({ message: 'Resume saved successfully' });
  } catch (err) {
    console.error('SAVE ERROR:', err);
    res.status(500).json({ error: 'Error saving resume' });
  }
});

// GET LATEST RESUME
app.get('/api/resume', async (req, res) => {
  try {
    const [detailsRows] = await pool.execute(
      'SELECT * FROM resume_details ORDER BY id DESC LIMIT 1'
    );

    if (detailsRows.length === 0) {
      return res.json({ message: 'No resume found' });
    }

    const details = detailsRows[0];
    const resumeId = details.id;

    const [educationRows] = await pool.execute(
      'SELECT * FROM education WHERE resume_id = ?',
      [resumeId]
    );

    const [projectRows] = await pool.execute(
      'SELECT * FROM projects WHERE resume_id = ?',
      [resumeId]
    );

    res.json({
      details,
      education: educationRows,
      projects: projectRows
    });
  } catch (err) {
    console.error('FETCH ERROR:', err);
    res.status(500).json({ error: 'Error fetching resume' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});