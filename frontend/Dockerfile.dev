# # Dockerfile.dev
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port du dev server React
EXPOSE 5173

# Lancer le serveur de dev (Vite par défaut pour React+TS)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
