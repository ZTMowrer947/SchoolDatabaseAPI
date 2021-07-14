import { Client } from "./deps.ts";

export default async function connectDb() {
  const db = await new Client().connect({
    hostname: Deno.env.get("DATABASE_HOST"),
    port: parseInt(Deno.env.get("DATABASE_PORT") ?? "3306"),
    username: Deno.env.get("DATABASE_USER"),
    password: Deno.env.get("DATABASE_PASSWORD"),
    db: Deno.env.get("DATABASE_NAME"),
  });

  return db;
}
