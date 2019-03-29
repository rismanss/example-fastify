'use strict';
const {Storage} = require('@google-cloud/storage');
const gcs = new Storage({
  projectId: 'testupload-1eab6',
  keyFilename: './testupload-d93f8f7d5d84.json' // yang ini mungkin bisa di hapus
});

const bucketName = 'staging.testupload-1eab6.appspot.com';
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

function sendUploadToGCS(req, res, next) {
  if (!req.file) {
    return next();
  }
  const gcsname = req.file.originalname;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });
  stream.on('error', err => {
    req.file.cloudStorageError = err;
    next(err);
  });
  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
      next();
    });
  });
  stream.end(req.file.buffer);
}

module.exports = { sendUploadToGCS, getPublicUrl };
