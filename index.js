const { authorize } = require('./auth');
const { listFiles } = require('./drive')

const PORT = 3000;

const express = require('express');
const app = express();

// Express route to trigger listing files
app.get('/list-files', (req, res) => {
  authorize().then((authClient) => listFiles(authClient)).then((list) => res.send(list));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});