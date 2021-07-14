import connectDb from "../db.ts";
import { Middleware } from "../deps.ts";
import type { DbState } from "../types.ts";

const database: Middleware<DbState> = async (ctx, next) => {
  const db = await connectDb();

  try {
    ctx.state.db = db;

    await next();
  } finally {
    await ctx.state.db.close();
  }
};

export default database;
