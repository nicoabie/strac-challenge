const { google } = require('googleapis');

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
  return res.data;
}

/**
 * Gets fileId stream
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {string} fileId origin.
 */
async function getFile(authClient, fileId) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await Promise.all([
    drive.files.get({ fileId: fileId, fields: 'name' }),
    drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })
  ]);
  return { name: res[0].data.name, stream: res[1].data };
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
  getFile,
  listFileUsers
}