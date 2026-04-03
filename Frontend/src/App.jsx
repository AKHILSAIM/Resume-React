import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import ResumeForm from './components/ResumeForm';
import ResumeView from './components/ResumeView';
import './App.css';

function App() {
  return (
    <div className="main-container">
      <h1>Resume Web App</h1>

      <nav className="nav-bar">
        <NavLink to="/form">Enter Resume</NavLink>
        <NavLink to="/view">View Resume</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/form" replace />} />
        <Route path="/form" element={<ResumeForm />} />
        <Route path="/view" element={<ResumeView />} />
      </Routes>
    </div>
  );
}

export default App;