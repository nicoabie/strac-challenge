const { google } = require('googleapis');
const createWriteStream = require('fs').createWriteStream;

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  console.log('Files:');
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
}

/**
 * Downloads fileId stream into filename
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {string} fileId origin.
 * @param {string} filename destination.
 */
function downloadFile(authClient, fileId, filename) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const dest = createWriteStream(filename);
  drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' },
    (err, res) => {
      if (err) return console.error('The API returned an error:', err.message);
      res.data
        .on('error', err => console.error(err))
        .on('end', () => console.log('Downloaded file.'))
        .pipe(dest);
    });
}

/**
 * Logs fileId users into the console
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {string} fileId origin.
 */
async function listFileUsers(authClient, fileId) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.permissions.list({
    fileId: fileId,
    fields: 'permissions(emailAddress,displayName)',
  });
  const users = res.data.permissions;
  if (users.length) {
    console.log('Users with access to the file:');
    users.forEach((user) => {
      console.log(`${user.displayName || user.emailAddress}`);
    });
  } else {
    console.log('No users found with access to the file.');
  }
}

module.exports = {
  listFiles,
  downloadFile,
  listFileUsers
}