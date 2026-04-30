# ============================================================
# apps/react-app/Dockerfile
# Multi-stage build: Node builder → Nginx runtime
# ============================================================

# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json tsconfig.base.json ./

COPY apps/react-app/package.json ./apps/react-app/
COPY libs/core/package.json ./libs/core/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm nx build react-app

# ── Stage 2: Runtime ────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*

#COPY --from=builder /app/dist/apps/react-app /usr/share/nginx/html
COPY --from=builder /app/apps/react-app/dist /usr/share/nginx/html
COPY apps/react-app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
