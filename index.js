const { authorize } = require('./auth');
const { listFiles, getFile, getUsersWithFilePermission } = require('./drive')

const PORT = 3000;
const SEND_INTERVAL = 2000;

const express = require('express');
const { renderFiles, renderWatchPage } = require('./render');
const app = express();

app.get('/list-files/:pageToken?', (req, res) => {
  const pageToken = req.params.pageToken;
  authorize().then((authClient) => listFiles(authClient, pageToken)).then((list) => res.send(renderFiles(list, pageToken)));
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
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
  });
  const watchFileInterval = setInterval(() => {
    authorize().then((authClient) => getUsersWithFilePermission(authClient, fileId)).then((users) => {
      res.write(`data: ${JSON.stringify(users)}\n\n`);
    });
  }, SEND_INTERVAL);

  req.on('close', () => clearInterval(watchFileInterval));
});

app.get('/watch/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  res.send(renderWatchPage(fileId));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});