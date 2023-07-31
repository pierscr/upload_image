# Usa l'immagine di Node.js versione 16
FROM node:16

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia i file package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutti i file nell'attuale contesto nella directory di lavoro
COPY . .

# Espone la porta 3000 per il normale funzionamento dell'applicazione
EXPOSE 3000

# Espone la porta 9229 per il debug dell'applicazione
EXPOSE 9229

# Avvia l'applicazione in modalità debug (porta 9229)
CMD ["npm", "run", "debug"]
