FROM --platform=$BUILDPLATFORM node:18-alpine AS builder
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile 
COPY . .
RUN yarn run build

FROM --platform=$TARGETPLATFORM gcr.io/distroless/nodejs:18
WORKDIR /srv/sqp
USER 1000
COPY --from=builder /build/.next/standalone /srv/sqp
COPY --from=builder /build/.next/static /srv/sqp/.next/static
CMD ["server.js"]
