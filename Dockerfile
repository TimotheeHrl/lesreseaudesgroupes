FROM mhart/alpine-node:16 as base
WORKDIR /opt/app
RUN apk --update add --no-cache curl git python3 alpine-sdk \
  bash autoconf libtool automake

FROM base as env
COPY package*.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

FROM env as dev
COPY . .
RUN yarn global add blitz
RUN yarn blitz prisma generate 
CMD  ["yarn","dev"]

FROM dev as build
RUN yarn next telemetry disable  && NODE_OPTIONS="--max-old-space-size=8096" npm run build
FROM base as prod
COPY --from=build /opt/app/package.json /opt/app/.blitz.config.compiled.js /opt/app/server.ts ./
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/.blitz ./.blitz
COPY --from=build /opt/app/.next ./.next
COPY --from=dev /opt/app/db ./db
CMD ["yarn","start"]