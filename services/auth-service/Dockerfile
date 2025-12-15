# 1. Use lightweight Node image
FROM node:20-alpine

WORKDIR /app

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy dependency files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Expose service port
EXPOSE 4000

# 7. Start the service
CMD ["npm", "start"]
