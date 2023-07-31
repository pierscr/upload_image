// /src/logger.js
const winston = require('winston');

// Configura le opzioni per il logger
const logger = winston.createLogger({
  level: 'info', // Imposta il livello minimo di log da scrivere
  format: winston.format.combine(
    winston.format.timestamp(), // Aggiunge il timestamp ai log
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
