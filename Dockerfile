FROM --platform=$BUILDPLATFORM node:18-alpine AS builder
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile 
COPY . .
RUN yarn run build

FROM node:18-alpine
WORKDIR /srv/sqp
USER daemon
COPY --from=builder /build/.next/standalone /srv/sqp
COPY --from=builder /build/.next/static /srv/sqp/.next/static
COPY public /srv/sqp/public
CMD ["node", "server.js"]
