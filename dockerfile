### ====================
### Stage 1: Base Image
###	====================
FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY ./package.json /app/package.json

RUN corepack enable

### ======================================
### Stage 2.1: Setup runtime dependencies
### ======================================
FROM base AS deps-runtime

COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./pnpm-workspace.yaml /app/pnpm-workspace.yaml

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

### ====================================
### Stage 2.2: Setup build dependencies
### ====================================
FROM base AS deps-build

COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./pnpm-workspace.yaml /app/pnpm-workspace.yaml

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

### ===============================================================
### Stage 3: Setup builder (install any necessary OS dependencies)
### ===============================================================
FROM base AS builder
# git is needed in svelte.config for versioning
RUN apk --no-cache add git

### ===========================================
### Stage 4: Build the application, here:
### - inject build-time environment variables
### - build the application
### ===========================================
FROM builder AS build

ENV VITE_PRIVATE_DATA_PATH="/data"

COPY . /app
COPY --from=deps-build /app/node_modules /app/node_modules

WORKDIR /app
RUN pnpm build

### ===================================================
### Stage 5: Put together final executable image, here
### - inject runtime environment variables
### ===================================================
FROM base AS runner

ARG PORT
ENV PORT=${PORT}

ARG ORIGIN
ENV ORIGIN=${ORIGIN}

COPY --from=deps-runtime /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

EXPOSE ${PORT}

VOLUME ["/data"]

WORKDIR /app
CMD ["node", "build"]

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=30s --start-interval=5s CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/version || exit 1
