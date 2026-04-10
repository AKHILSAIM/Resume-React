import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResumeForm.css';

function ResumeForm() {
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    details: {
      name: '',
      title: '',
      summary: '',
      phone: '',
      email: '',
      address: '',
      skills: '',
      languages: '',
      personality_traits: ''
    },
    education: [
      { degree: '', institute: '', year: '', score: '' },
      { degree: '', institute: '', year: '', score: '' },
      { degree: '', institute: '', year: '', score: '' }
    ],
    projects: [
      { title: '', description: '' },
      { title: '', description: '' }
    ]
  });

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: value
      }
    }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...resumeData.education];
    updatedEducation[index][name] = value;

    setResumeData((prev) => ({
      ...prev,
      education: updatedEducation
    }));
  };

  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProjects = [...resumeData.projects];
    updatedProjects[index][name] = value;

    setResumeData((prev) => ({
      ...prev,
      projects: updatedProjects
    }));
  };

 const saveResume = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/resume`,
      resumeData
    );
    alert(response.data.message);
    navigate('/view');
  } catch (error) {
    console.error('Save error:', error);
    console.error('Backend response:', error.response?.data);
    alert(
      error.response?.data?.details ||
      error.response?.data?.error ||
      'Error saving resume'
    );
  }
};

  return (
    <div className="container">
      <h2>Enter Resume Details</h2>

      <div className="card">
        <label>Name</label>
        <input type="text" name="name" value={resumeData.details.name} onChange={handleDetailsChange} />

        <label>Title</label>
        <input type="text" name="title" value={resumeData.details.title} onChange={handleDetailsChange} />

        <label>Summary</label>
        <textarea name="summary" value={resumeData.details.summary} onChange={handleDetailsChange} />

        <label>Phone</label>
        <input type="text" name="phone" value={resumeData.details.phone} onChange={handleDetailsChange} />

        <label>Email</label>
        <input type="email" name="email" value={resumeData.details.email} onChange={handleDetailsChange} />

        <label>Address</label>
        <textarea name="address" value={resumeData.details.address} onChange={handleDetailsChange} />

        <label>Skills (comma separated)</label>
        <textarea name="skills" value={resumeData.details.skills} onChange={handleDetailsChange} />

        <label>Languages (comma separated)</label>
        <textarea name="languages" value={resumeData.details.languages} onChange={handleDetailsChange} />

        <label>Personality Traits (comma separated)</label>
        <textarea
          name="personality_traits"
          value={resumeData.details.personality_traits}
          onChange={handleDetailsChange}
        />
      </div>

      <h2>Education</h2>

      {resumeData.education.map((edu, index) => (
        <div className="card" key={index}>
          <h3>Degree {index + 1}</h3>

          <label>Degree</label>
          <input
            type="text"
            name="degree"
            value={edu.degree}
            onChange={(e) => handleEducationChange(index, e)}
          />

          <label>Institute</label>
          <input
            type="text"
            name="institute"
            value={edu.institute}
            onChange={(e) => handleEducationChange(index, e)}
          />

          <label>Year</label>
          <input
            type="text"
            name="year"
            value={edu.year}
            onChange={(e) => handleEducationChange(index, e)}
          />

          <label>Score</label>
          <input
            type="text"
            name="score"
            value={edu.score}
            onChange={(e) => handleEducationChange(index, e)}
          />
        </div>
      ))}

      <h2>Projects</h2>

      {resumeData.projects.map((project, index) => (
        <div className="card" key={index}>
          <h3>Project {index + 1}</h3>

          <label>Title</label>
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={(e) => handleProjectChange(index, e)}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={project.description}
            onChange={(e) => handleProjectChange(index, e)}
          />
        </div>
      ))}

      <div className="button-group">
        <button type="button" onClick={saveResume}>Save Resume</button>
      </div>
    </div>
  );
}

export default ResumeForm;