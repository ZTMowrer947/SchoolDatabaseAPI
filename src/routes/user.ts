import { Router } from "../deps.ts";
import auth from "../middleware/auth.ts";

const userRouter = new Router({
  prefix: "/api/users",
});

userRouter.get("/", auth, (ctx) => {
  ctx.response.body = ctx.state.user;
});

export default userRouter;
