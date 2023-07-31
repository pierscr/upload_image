const { uploadFile } = require('../services/minioService');
const { createCoverageStore, createCoverage, getCoverageData } = require('../services/geoserverService');
const { insertCropMap } = require('../services/mongoService');
const { getMongoObject } = require('../models/CropMap'); // Importiamo la funzione dal file cropmap.js


// Handler for the image upload endpoint
exports.uploadImage = async (req, res, next) => {
  try {
    const parcelId = req.query.parcelId;
    const date = req.query.date;
    const type = req.query.type;
    const source = req.query.source;

    const imageName = `${type}-${parcelId}-${date}-${source}.tif`;
    const layerName = `${type}-${parcelId}-${date}-${source}`;
    const minioImageUrl = `${process.env.MINIO_BUCKET}/${imageName}`;

    const filePath = req.file.path;

    console.log('Starting file upload to Minio...');
    // Call the uploadFile function from minioService to upload the image to Minio
    await uploadFile(imageName, filePath);
    console.log('File uploaded to Minio successfully.');

    // Additional block for GeoServer integration
    console.log('Creating coverage store on GeoServer...');
    // Creating coverage store on GeoServer
    await createCoverageStore(layerName, minioImageUrl);
    console.log('Coverage store created on GeoServer.');

    console.log('Creating coverage on GeoServer...');
    // Creating coverage on GeoServer
    await createCoverage(layerName);
    console.log('Coverage created on GeoServer.');

    // Getting coverage data from GeoServer
    console.log('Getting coverage data from GeoServer...');
    const coverageData = await getCoverageData(layerName);

    // Create the mongoObject to be inserted into the database
    console.log('Writing cropmap object to MongoDB');
    const mongoObject = getMongoObject(parcelId, date, type, source, layerName, coverageData);

    console.log('Object created');
    // Insert the mongoObject into the MongoDB collection
    await insertCropMap(mongoObject);

    console.log('Cropmap object written to MongoDB');

    res.status(200).json({ message: 'Image uploaded and processed successfully.' });
  } catch (error) {
    console.error('Error:', error.message);

    if (error.response) {
      const url = error.response.config.url;
      if (url.includes(process.env.MINIO_ENDPOINT)) {
        console.error('Error while interacting with Minio. Please check the Minio server.');
        res.status(500).json({ error: 'Minio server error.' });
      } else if (url.includes('coveragestores')) {
        console.error('Error while creating coverage store on GeoServer.');
        console.error('with current error:');
        console.error(error.response.data);
        res.status(500).json({ error: 'GeoServer Coverage Store error.' });
        console.error('Deleting uploaded image...');
        // Delete the uploaded image if there is an error
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error while deleting the image:', err);
          } else {
            console.log('Image deleted from the uploads folder.');
          }
        });
      } else if (url.includes('coverages')) {
        console.error('Error while creating coverage on GeoServer.');
        console.error('with current error:');
        console.error(error.response.data);
        res.status(500).json({ error: 'GeoServer Coverage error.' });
      } else {
        console.error('An unexpected error occurred.');
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    } else if (error.name === 'MongoError' && error.code === 11000) {
      res.status(500).json({ error: 'Duplicated key error. The document already exists in the collection.' });
    } else {
      console.error('An unexpected error occurred.');
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
};
