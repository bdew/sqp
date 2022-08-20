FROM node:18-alpine AS builder
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile 
COPY . .
RUN yarn run build

FROM node:18-alpine
WORKDIR /srv/sqp
USER daemon
COPY --from=builder /build /srv/sqp
CMD yarn start