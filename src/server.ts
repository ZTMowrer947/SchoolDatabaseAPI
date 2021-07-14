import "https://deno.land/x/dotenv@v2.0.0/load.ts";

import { Application } from "./deps.ts";
import courseRouter from "./routes/course.ts";
import userRouter from "./routes/user.ts";
import database from "./middleware/database.ts";
import httpErrorHandler from "./middleware/httpErrorHandler.ts";

const app = new Application();

app.use(httpErrorHandler);
app.use(database);
app.use(courseRouter.routes());
app.use(courseRouter.allowedMethods());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

await app.listen("127.0.0.1:8000");
