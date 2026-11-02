FROM --platform=$BUILDPLATFORM node:26-alpine AS builder
WORKDIR /build
COPY package.json yarn.lock .yarnrc.yml ./
RUN --mount=type=cache,target=/root/.yarn/berry/cache,sharing=locked \
    --mount=type=cache,target=/root/.npm \
    npm install -g corepack && \
    corepack enable && \
    yarn install --immutable 
COPY . .
RUN yarn lint
RUN yarn build

FROM gcr.io/distroless/nodejs26-debian13:latest
WORKDIR /srv/sqp
USER 1000
COPY --from=builder /build/.next/standalone /srv/sqp
COPY --from=builder /build/.next/static /srv/sqp/.next/static
COPY public /srv/sqp/public
CMD ["server.js"]
