const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/resume', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { details, education, projects } = req.body;

    await connection.beginTransaction();

    const detailSql = `
      INSERT INTO resume_details
      (name, title, summary, phone, email, address, skills, languages, personality_traits)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [detailResult] = await connection.execute(detailSql, [
      details.name,
      details.title,
      details.summary,
      details.phone,
      details.email,
      details.address,
      details.skills,
      details.languages,
      details.personality_traits
    ]);

    const resumeId = detailResult.insertId;

    const educationSql = `
      INSERT INTO education (resume_id, degree, institute, year, score)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const edu of education) {
      await connection.execute(educationSql, [
        resumeId,
        edu.degree,
        edu.institute,
        edu.year,
        edu.score
      ]);
    }

    const projectSql = `
      INSERT INTO projects (resume_id, title, description)
      VALUES (?, ?, ?)
    `;

    for (const project of projects) {
      await connection.execute(projectSql, [
        resumeId,
        project.title,
        project.description
      ]);
    }

    await connection.commit();

    res.json({
      message: 'Resume saved successfully',
      resumeId
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to save resume' });
  } finally {
    connection.release();
  }
});

app.get('/api/resume', async (req, res) => {
  try {
    const [detailsRows] = await pool.execute(
      'SELECT * FROM resume_details ORDER BY id DESC LIMIT 1'
    );

    if (detailsRows.length === 0) {
      return res.status(404).json({ message: 'No resume found' });
    }

    const details = detailsRows[0];
    const resumeId = details.id;

    const [educationRows] = await pool.execute(
      'SELECT degree, institute, year, score FROM education WHERE resume_id = ?',
      [resumeId]
    );

    const [projectRows] = await pool.execute(
      'SELECT title, description FROM projects WHERE resume_id = ?',
      [resumeId]
    );

    res.json({
      details,
      education: educationRows,
      projects: projectRows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});