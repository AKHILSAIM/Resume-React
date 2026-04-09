import { useEffect, useState } from 'react';
import axios from 'axios';
import './ResumeView.css';

function ResumeView() {
  const [fetchedResume, setFetchedResume] = useState(null);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/resume`);
      setFetchedResume(response.data);
    } catch (error) {
      console.error(error);
      alert('Error loading resume');
    }
  };

  const toArray = (value) => {
    if (!value) return [];
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  };

  const formatName = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length <= 2) return name;
    return parts.slice(0, 2).join(' ') + '\n' + parts.slice(2).join(' ');
  };

  if (!fetchedResume) {
    return <div className="empty-message">No resume data found.</div>;
  }

  return (
    <div className="resume-page">
      <div className="resume-container">
        <div className="left-column">
          <div className="contact-section">
            <p>{fetchedResume.details.phone}</p>
            <p>{fetchedResume.details.email}</p>
            <p>{fetchedResume.details.address}</p>
          </div>

          <div className="section">
            <h3>Education</h3>
            {fetchedResume.education.map((edu, index) => (
              <div className="education-item" key={index}>
                <p className="degree">{edu.degree}</p>
                <p>{edu.institute}</p>
                <p>{edu.year}</p>
                <p>{edu.score}</p>
              </div>
            ))}
          </div>

          <div className="section">
            <h3>Expertise</h3>
            <ul>
              {toArray(fetchedResume.details.skills).map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>Language</h3>
            <ul>
              {toArray(fetchedResume.details.languages).map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>Personality Traits</h3>
            <ul>
              {toArray(fetchedResume.details.personality_traits).map((trait, index) => (
                <li key={index}>{trait}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="right-column">
          <div className="header-section">
            <h1>{formatName(fetchedResume.details.name)}</h1>
            <h2>{fetchedResume.details.title}</h2>
          </div>

          <div className="summary-section">
            <p>{fetchedResume.details.summary}</p>
          </div>

          <div className="projects-section">
            <h3>Academic Projects</h3>

            {fetchedResume.projects.map((project, index) => (
              <div className="project-item" key={index}>
                <h4>{project.title}</h4>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeView;