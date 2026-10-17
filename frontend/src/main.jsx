import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load jobs');
        return res.json();
      })
      .then(setJobs)
      .catch(() => setError('Jobs load nahi ho paayi. Please try again.'));
  }, []);

  const filteredJobs = jobs.filter(job =>
    `${job.title} ${job.company} ${job.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <nav className="navbar">
        <h2>JobFinder</h2>
        <span>Find your next opportunity</span>
      </nav>

      <header className="hero">
        <p className="eyebrow">YOUR CAREER STARTS HERE</p>
        <h1>Find a job that fits your future.</h1>
        <p>Discover opportunities and take the next step in your career.</p>

        <input
          aria-label="Search jobs"
          placeholder="Search by role, company or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>

      <main className="container">
        <h2>Latest opportunities</h2>

        {error && <p role="alert">{error}</p>}

        <div className="job-grid">
          {filteredJobs.map(job => (
            <article className="job-card" key={job.id}>
              <span className="tag">OPEN POSITION</span>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p className="location">📍 {job.location}</p>
              <button onClick={() => alert(`Selected: ${job.title}`)}>
                View Job
              </button>
            </article>
          ))}
        </div>

        {!error && filteredJobs.length === 0 && (
          <p>No jobs found matching your search.</p>
        )}
      </main>

      <footer>JobFinder · Built with React, Node.js and Docker</footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
