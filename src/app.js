const express = require('express');
const dotenv = require('dotenv');
const uploadRoutes = require('./routes/uploadRoutes');
const logger = require('../logger'); // Importa il logger configurato

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(uploadRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  logger.info('Staring logging with winston...');
  console.log(`API server is running on port ${PORT}.`);
});
