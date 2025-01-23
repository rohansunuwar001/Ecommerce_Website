import { config } from "dotenv";

config();
export let port = process.env.PORT;
export let secretKey = process.env.SECRET_KEY;
export let databasePath = process.env.DB_URL;
export let expiryInfo = process.env.JWT_EXPIRE;
export let cookieExpires = process.env.COOKIE_EXPIRE;