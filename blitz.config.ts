import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"

const config: BlitzConfig = {
  env: {
    BUCKETNAME: process.env.BUCKETNAME,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    BASE_URL: process.env.BASE_URL,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    MAPBOX_API_TOKEN: process.env.MAPBOX_API_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  middleware: [
    sessionMiddleware({
      cookiePrefix: "cookiesplateformeshowcase",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
}

module.exports = config
