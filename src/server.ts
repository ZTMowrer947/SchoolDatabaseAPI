import { Application } from "./deps.ts";
import courseRouter from "./routes/course.ts";

const app = new Application();

app.use(courseRouter.routes());
app.use(courseRouter.allowedMethods());

await app.listen("127.0.0.1:8000");
