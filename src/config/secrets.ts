import fs from "fs";
import dotenv from "dotenv";
import logger from "../util/logger";

/* Reading .env files according to current environment */
if (fs.existsSync(".env.staging")) {
  logger.debug("Using .env.staging file to supply config environment variables");
  dotenv.config({ path: ".env.staging" });
} else {
  logger.debug("Using .env.production file to supply config environment variables");
  dotenv.config({ path: ".env.production" }); // you can delete this after you create your own .env file!
}

/* We'll be importing all the envs from this file */
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI"];
export const SENDGRID_API_KEY = process.env["SENDGRID_API_KEY"];

export const BCRYPT_SALT = process.env["BCRYPT_SALT"];

export const CLOUDINARY_CLOUD_NAME = process.env["cloud_name"];
export const CLOUDINARY_API_KEY = process.env["api_key"];
export const CLOUDINARY_API_SECRET = process.env["api_secret"];

if (!SESSION_SECRET) {
  logger.error("No client secret. Set SESSION_SECRET environment variable.");
  process.exit(1);
}

if (!MONGODB_URI) {
  if (prod) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
  } else {
    logger.error("No mongo connection string. Set MONGODB_URI_LOCAL environment variable.");
  }
  process.exit(1);
}
