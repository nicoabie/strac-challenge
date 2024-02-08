const { authorize } = require('./auth');
const { listFiles } = require('./drive')

const PORT = 3000;

const express = require('express');
const app = express();


authorize().then(listFiles).catch(console.error);
// authorize().then((authClient) => downloadFile(authClient, '1Dh50EV8d3R2WG2BRRl8Yr8QL189GZ9xS', 'test_download')).catch(console.error);