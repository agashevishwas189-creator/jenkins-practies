const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    application: 'job-seeking-website-backend'
  });
});

app.get('/api/jobs', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Demo Company',
      location: 'Remote'
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'Demo Company',
      location: 'Pune'
    }
  ]);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
