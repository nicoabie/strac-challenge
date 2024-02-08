const { authorize } = require('./auth');
const { listFiles, getFile, getUsersWithFilePermission } = require('./drive')

const PORT = 3000;
const SEND_INTERVAL = 2000;
let watchFileInterval;

const express = require('express');
const { renderFiles, renderWatchPage } = require('./render');
const app = express();

// Express route to trigger listing files
app.get('/list-files', (req, res) => {
  authorize().then((authClient) => listFiles(authClient)).then((list) => res.send(renderFiles(list)));
});

app.get('/download-file/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  authorize().then((authClient) => getFile(authClient, fileId)).then((file) => {
    res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
    file.stream.pipe(res)
  });
});


app.get('/watch-file/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  clearInterval(watchFileInterval);
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
  });
  watchFileInterval = setInterval(() => {
    authorize().then((authClient) => getUsersWithFilePermission(authClient, fileId)).then((users) => {
      res.write(`data: ${JSON.stringify(users)}\n\n`);
    });
  }, SEND_INTERVAL);
});

app.get('/watch/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  res.send(renderWatchPage(fileId));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});