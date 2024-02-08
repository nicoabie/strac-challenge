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
 * Gets the users with access to the file
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {string} fileId origin.
 */
async function getUsersWithFilePermission(authClient, fileId) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.permissions.list({
    fileId: fileId,
    fields: 'permissions(emailAddress,displayName)',
  });
  return res.data.permissions;
}

module.exports = {
  listFiles,
  getFile,
  getUsersWithFilePermission
}