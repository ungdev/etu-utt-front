ARG NODE_VERSION=19-alpine

FROM node:${NODE_VERSION}

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN npm i -g pnpm && pnpm install --frozen-lockfile --prod=false

COPY --chown=node:node . .

RUN pnpm next build

ENV NODE_ENV production

RUN pnpm install -P

USER node

CMD pnpm next start -p 8080
