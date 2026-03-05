# --- STAGE 1: Build ---
    FROM node:20-slim AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    # This creates the entire /dist folder including index.js and data.js
    RUN npm run build 
    
    # --- STAGE 2: Run ---
    FROM node:20-slim
    WORKDIR /app
    ENV NODE_ENV=production
    COPY package*.json ./
    RUN npm install --omit=dev
    # Copy the entire compiled directory
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/docs ./docs
    
    EXPOSE 3000
    EXPOSE 4000
    CMD ["node", "dist/index.js"]