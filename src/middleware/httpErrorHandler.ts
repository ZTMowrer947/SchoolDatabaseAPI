import { Middleware, isHttpError, Status, STATUS_TEXT } from "../deps.ts";

const httpErrorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      console.error(err.stack ?? err.message);

      ctx.response.status = err.status;
      if (err.expose || err.status !== Status.InternalServerError) {
        ctx.response.body = {
          error: {
            message:
              err.message ?? STATUS_TEXT.get(err.status) ?? "Unexpected Error",
          },
        };
      } else {
        ctx.response.body = {
          error: {
            message: "Unexpected Error",
          },
        };
      }
    } else {
      console.error(err);
      throw err;
    }
  }
};

export default httpErrorHandler;
