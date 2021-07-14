// Code based on basic-auth NPM package

import { bcryptCompare } from "../deps.ts";
import type { Context, Middleware } from "../deps.ts";
import type { DbState, User } from "../types.ts";

const credentialsRegExp =
  /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

const decodedUserPassRegExp = /^([^:]*):(.*)$/;

interface AuthResult {
  user: string;
  password: string;
}

interface AuthState extends DbState {
  user: User;
}

interface RawUser extends User {
  password: string;
}

function parseCredentials(ctx: Context): AuthResult | undefined {
  // Get value of Authorization field
  const authHeader = ctx.request.headers.get("authorization");

  // If not present, return nothing
  if (typeof authHeader !== "string") return undefined;

  // Attempt to extract encoded credentials from header
  const credMatch = credentialsRegExp.exec(authHeader);

  // If this fails, return nothing
  if (!credMatch) return undefined;

  // Decode credentials from base64
  const decodedCredentials = atob(credMatch[1]);

  // Extract user and password
  const userPass = decodedUserPassRegExp.exec(decodedCredentials);

  // If this fails, return nothing
  if (!userPass) return undefined;

  // Return extracted credentials
  return {
    user: userPass[1],
    password: userPass[2],
  };
}

const auth: Middleware<AuthState> = async (ctx, next) => {
  const credentials = parseCredentials(ctx);

  if (!credentials)
    return ctx.throw(401, "authorization required for requested route");

  const result = (await ctx.state.db.query(
    `
    SELECT id, firstName, lastName, emailAddress, password
    FROM User
    WHERE emailAddress = ?
  `,
    [credentials.user]
  )) as RawUser[];

  if (
    result.length === 0 ||
    !(await bcryptCompare(credentials.password, result[0].password))
  )
    return ctx.throw(401, "incorrect email/password combination");

  const { password: _password, ...user } = result[0];

  ctx.state.user = user;

  await next();
};

export default auth;
