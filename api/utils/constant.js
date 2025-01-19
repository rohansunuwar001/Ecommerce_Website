import { config } from "dotenv";

config();
export let secretKey = process.env.SECRET_KEY;
export let databasePath = process.env.DB_URL;