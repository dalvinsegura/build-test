import { config } from "dotenv";
import { Pool, Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});
