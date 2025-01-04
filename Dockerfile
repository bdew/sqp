FROM --platform=$BUILDPLATFORM node:22-alpine AS builder
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile 
COPY . .
RUN yarn run build

FROM gcr.io/distroless/nodejs22-debian12:latest
WORKDIR /srv/sqp
USER 1000
COPY --from=builder /build/.next/standalone /srv/sqp
COPY --from=builder /build/.next/static /srv/sqp/.next/static
COPY public /srv/sqp/public
CMD ["server.js"]
