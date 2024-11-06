# Dockerfile pro frontend

# Použití oficiálního Node.js obrazu
FROM node:18

# Nastavení pracovního adresáře
WORKDIR /app

# Kopírování package.json a package-lock.json
COPY package*.json ./

# Instalace závislostí
RUN npm install

# Kopírování zbytku aplikace
COPY . .

# Exponování portu
EXPOSE 3000

# Spuštění aplikace
CMD ["npm", "run", "dev"]
