# Root-level Dockerfile — Railway auto-detects this file.
# Build context: repository root (Railway default).

FROM node:20-alpine AS deps
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 hexcore

WORKDIR /app
COPY --from=deps --chown=hexcore:nodejs /app/node_modules ./node_modules
COPY --chown=hexcore:nodejs backend/ .

USER hexcore

ENV NODE_ENV=production
# Railway injects PORT at runtime; 8080 is documentation only
EXPOSE 8080

CMD ["node", "server.js"]
