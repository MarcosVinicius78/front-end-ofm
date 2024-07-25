const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = path.join(process.cwd(), 'dist/browser');
const SERVER_FOLDER = path.join(process.cwd(), 'dist/server');

// Serve only the static files form the dist directory
app.use(express.static(DIST_FOLDER));

// Pointing to the server-side rendered file
app.get('/*', (req, res) => {
  res.sendFile(path.join(SERVER_FOLDER, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
