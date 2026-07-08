# Multi-stage build for the Next.js web app (used for containerized/prod builds).
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY packages/contracts/package.json ./packages/contracts/
RUN npm install --workspaces --include-workspace-root

FROM deps AS build
COPY . .
RUN npm run build --workspace @bankbridge/web

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/package.json ./apps/web/
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace", "@bankbridge/web"]
