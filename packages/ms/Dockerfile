FROM node:hydrogen-alpine AS base
RUN npm install -g @nestjs/cli

# Develop
FROM base AS dev
ARG APP=APP
ENV APP=${APP}

ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}

ENV REDIS_HOST=redis

WORKDIR /app
COPY package*.json .
RUN npm ci
# TODO: copy only the necessary files
COPY . .
# RUN npm run build ${APP}
CMD nest start ${APP} --watch

# Production
# FROM base AS prod
## TODO