# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]

# ---------- DEVELOPMENT STAGE ----------
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]