ARG NODE_VERSION=22-alpine

ARG NODE_ENV=production
ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ARG NEXT_PUBLIC_CAS_SERVICE_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_VERSION=v1
ARG NEXT_PUBLIC_API_REQUEST_TIMEOUT=10000

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_CAS_SERVICE_URL=${NEXT_PUBLIC_CAS_SERVICE_URL}
ENV NEXT_PUBLIC_API_VERSION=${NEXT_PUBLIC_API_VERSION}
ENV NEXT_PUBLIC_API_REQUEST_TIMEOUT=${NEXT_PUBLIC_API_REQUEST_TIMEOUT}

FROM node:${NODE_VERSION}

WORKDIR /usr/src/app

# Add alpine dependencies for 'sharp'
RUN apk add --upgrade --no-cache vips-dev build-base

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN npm i -g pnpm && pnpm install --frozen-lockfile --prod=false

COPY --chown=node:node . .

RUN pnpm next build

ENV NODE_ENV production

RUN pnpm install -P

USER node

CMD pnpm next start -p 8080
