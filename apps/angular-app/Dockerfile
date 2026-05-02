# ============================================================
# apps/angular-app/Dockerfile
# Multi-stage build: Node builder → Nginx runtime
# ============================================================

# ── Stage 1: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@9

# Copy workspace manifests first (cache layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json tsconfig.base.json ./

# ── FIX: approve build scripts for nx and native deps before install ──
COPY .npmrc ./.npmrc

# Copy package.json files for workspace resolution
COPY apps/angular-app/package.json ./apps/angular-app/
COPY libs/core/package.json ./libs/core/
COPY libs/design-tokens/package.json ./libs/design-tokens/
COPY libs/design-system-angular/package.json ./libs/design-system-angular/

RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/angular-app ./apps/angular-app
COPY libs/core ./libs/core
COPY libs/design-tokens ./libs/design-tokens
COPY libs/design-system-angular ./libs/design-system-angular

RUN pnpm nx reset
# ── FIX: disable Nx cloud cache upload in Docker ──
RUN NX_NO_CLOUD=true pnpm nx build angular-app --configuration=production

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/apps/angular-app/dist/angular-app/browser /usr/share/nginx/html
COPY apps/angular-app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
