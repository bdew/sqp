FROM --platform=$BUILDPLATFORM node:24-alpine AS builder
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile 
COPY . .
RUN yarn run build

FROM gcr.io/distroless/nodejs24-debian13:latest
WORKDIR /srv/sqp
USER 1000
COPY --from=builder /build/.next/standalone /srv/sqp
COPY --from=builder /build/.next/static /srv/sqp/.next/static
COPY public /srv/sqp/public
CMD ["server.js"]
