import type { Client } from "../deps.ts";
import type { Course } from "../types.ts";

type CoursePreview = Pick<Course, "id" | "title">;

interface RawCourse extends Omit<Course, "creator"> {
  creatorId: number;
  creatorFirstName: string;
  creatorLastName: string;
  creatorEmailAddress: string;
}

export function getCourses(db: Client): Promise<CoursePreview[]> {
  return db.query(`
    SELECT id, title
    FROM Course
  `);
}

export async function getCourse(
  db: Client,
  id: number
): Promise<Course | undefined> {
  const result = (await db.query(
    `
    SELECT Course.id, Course.title, Course.description,
      Course.estimatedTime, Course.materialsNeeded,
      User.id as creatorId, User.firstName as creatorFirstName,
      User.lastName as creatorLastName, User.emailAddress as creatorEmailAddress
    FROM Course
    LEFT JOIN User ON Course.creatorId = User.id
    WHERE Course.id = ?
    LIMIT 1
  `,
    [id]
  )) as RawCourse[];

  if (result.length == 0) return undefined;

  const [dbCourse] = result;

  const course: Course = {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    estimatedTime: dbCourse.estimatedTime,
    materialsNeeded: dbCourse.materialsNeeded,
    creator: {
      id: dbCourse.creatorId,
      firstName: dbCourse.creatorFirstName,
      lastName: dbCourse.creatorLastName,
      emailAddress: dbCourse.creatorEmailAddress,
    },
  };

  return course;
}
