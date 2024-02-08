const { authorize } = require('./auth');
const { listFiles, getFile } = require('./drive')

const PORT = 3000;

const express = require('express');
const app = express();

// Express route to trigger listing files
app.get('/list-files', (req, res) => {
  authorize().then((authClient) => listFiles(authClient)).then((list) => res.send(list));
});

app.get('/download-file/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  authorize().then((authClient) => getFile(authClient, fileId)).then((file) => {
    res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
    console.dir(file, {depth:null})
    file.stream.pipe(res)
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});