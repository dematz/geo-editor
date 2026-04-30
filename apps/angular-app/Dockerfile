# ============================================================
# apps/angular-app/Dockerfile
# Multi-stage build: Node builder → Nginx runtime
# ============================================================

# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@latest

# Copy workspace manifests first (cache layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json tsconfig.base.json ./

COPY apps/angular-app/package.json ./apps/angular-app/
COPY libs/core/package.json ./libs/core/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm nx build angular-app --configuration=production

# ── Stage 2: Runtime ────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/apps/angular-app /usr/share/nginx/html
COPY apps/angular-app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
