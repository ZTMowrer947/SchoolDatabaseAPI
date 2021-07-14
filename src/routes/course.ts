import { Router } from "../deps.ts";
import { getCourse, getCourses } from "../queries/course.ts";

const courseRouter = new Router({
  prefix: "/api/courses",
});

courseRouter.get("/", async (ctx) => {
  const courses = await getCourses(ctx.state.db);

  ctx.response.body = courses;
});

courseRouter.get("/:id", async (ctx) => {
  const id: number = Number.parseInt(ctx.params.id!);

  if (Number.isNaN(id)) {
    return ctx.throw(400, "course id must be numeric");
  }

  const course = await getCourse(ctx.state.db, id);

  if (!course) {
    return ctx.throw(404, "no course exists with given id");
  }

  ctx.response.body = course;
});

export default courseRouter;
