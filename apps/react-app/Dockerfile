# ============================================================
# apps/react-app/Dockerfile
# ============================================================

# ── Stage 1: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@latest

# Copy workspace manifests first (for dependency resolution)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json tsconfig.base.json ./

# Copy app and library package.json files (required for pnpm workspace resolution)
COPY apps/react-app/package.json ./apps/react-app/
COPY libs/core/package.json ./libs/core/
COPY libs/design-tokens/package.json ./libs/design-tokens/
COPY libs/design-system-react/package.json ./libs/design-system-react/

RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/react-app ./apps/react-app
COPY libs/core ./libs/core
COPY libs/design-tokens ./libs/design-tokens
COPY libs/design-system-react ./libs/design-system-react

# Build directly with vite — bypasses Nx cache entirely
WORKDIR /app/apps/react-app
RUN npx vite build

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/apps/react-app/dist /usr/share/nginx/html
COPY apps/react-app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
