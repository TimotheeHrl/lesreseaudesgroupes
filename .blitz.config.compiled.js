var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// blitz.config.ts
var import_blitz = __toModule(require("blitz"));
var config = {
  env: {
    BUCKETNAME: process.env.BUCKETNAME,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    BASE_URL: process.env.BASE_URL,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    MAPBOX_API_TOKEN: process.env.MAPBOX_API_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  middleware: [
    (0, import_blitz.sessionMiddleware)({
      cookiePrefix: "cookiesplateformeshowcase",
      isAuthorized: import_blitz.simpleRolesIsAuthorized
    })
  ]
};
module.exports = config;
