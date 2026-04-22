# Multi-stage build for minimal production image
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 hexcore

WORKDIR /app
COPY --from=deps --chown=hexcore:nodejs /app/node_modules ./node_modules
COPY --chown=hexcore:nodejs . .

USER hexcore

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "server.js"]
