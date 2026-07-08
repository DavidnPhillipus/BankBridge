# Multi-stage build for the NestJS API (used for containerized/prod builds).
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/contracts/package.json ./packages/contracts/
RUN npm install --workspaces --include-workspace-root

FROM deps AS build
COPY . .
RUN npm run build --workspace @bankbridge/api

FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
