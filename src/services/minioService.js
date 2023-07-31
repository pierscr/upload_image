const Minio = require('minio');
const fs = require('fs');

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
const MINIO_PORT = parseInt(process.env.MINIO_PORT);
const MINIO_BUCKET = process.env.MINIO_BUCKET;

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: false,
});

exports.uploadFile = async (imageName, filePath) => {
  // Carica il file su Minio utilizzando la libreria minio-js
  await minioClient.fPutObject(MINIO_BUCKET, imageName, filePath, { "Content-Type": "application/octet-stream" });

  // Elimina l'immagine dalla cartella uploads
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error while deleting the image:', err);
    } else {
      console.log('Image deleted from the uploads folder.');
    }
  });
};
