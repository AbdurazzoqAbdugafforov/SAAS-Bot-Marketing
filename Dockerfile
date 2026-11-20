FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source
COPY backend/ ./

# Generate Prisma Client
RUN npx prisma generate

ENV PORT=3001
ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "start"]
