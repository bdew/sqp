FROM --platform=$BUILDPLATFORM node:24-alpine AS builder
WORKDIR /build
COPY package.json yarn.lock .yarnrc.yml ./
RUN --mount=type=cache,target=/root/.yarn/berry/cache,sharing=locked \
    corepack enable && \
    yarn install --immutable 
COPY . .
RUN yarn lint
RUN yarn build

FROM gcr.io/distroless/nodejs24-debian13:latest
WORKDIR /srv/sqp
USER 1000
COPY --from=builder /build/.next/standalone /srv/sqp
COPY --from=builder /build/.next/static /srv/sqp/.next/static
COPY public /srv/sqp/public
CMD ["server.js"]
