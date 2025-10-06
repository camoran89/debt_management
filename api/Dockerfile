
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20 AS production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3000

USER node

CMD ["node", "dist/main.js"]
