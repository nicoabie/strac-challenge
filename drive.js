const { google } = require('googleapis');

const PAGE_SIZE = 20;

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {string?} pageToken for pagination
 */
async function listFiles(authClient, pageToken) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.files.list({
    pageSize: PAGE_SIZE,
    fields: 'nextPageToken, files(id, name)',
    pageToken
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
  const metadata = await drive.files.get({ fileId: fileId, fields: 'name, fileExtension' });

  if (metadata.data.fileExtension) {
    const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })
    return { name: metadata.data.name, stream: res.data };
  } else {
    const res = await drive.files.export({ fileId, mimeType: 'application/pdf' }, { responseType: 'stream' })
    return { name: `${metadata.data.name}.pdf`, stream: res.data };
  }
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