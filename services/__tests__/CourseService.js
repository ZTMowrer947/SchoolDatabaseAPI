// Imports
const CourseService = require("../CourseService");
const UserService = require("../UserService");
const { Course } = require("../../models");

// Test Suite
describe("Course service", () => {
    // Declare variables for test
    let service;
    let userService;
    let user;
    let course;

    // Run before all tests
    beforeAll(async () => {
        // Initialize services
        service = new CourseService();
        userService = new UserService();

        // Define test user data
        const userData = {
            firstName: "Jevil",
            lastName: "Chaos",
            emailAddress: "jevil@delta.rune",
            password: "ICANDOANYTHING", // You can tell I enjoy playing Deltarune...
        };

        // Create new user
        user = await userService.create(userData);
    });

    describe("create function", () => {
        test("should create a new course", async () => {
            // Define course data
            const courseData = {
                title: "Chaos Course",
                description: "CHAOS CHAOS CHAOS CHAOS CHAOS CHAOS CHAOS CHAOS",
            };

            // Create new course
            course = await service.create(user, courseData);

            // Expect course to match input data
            expect(course.userId).toBe(user.id);
            expect(course.title).toBe(courseData.title);
            expect(course.description).toBe(courseData.description);
            expect(course.estimatedTime).toBeNull();
            expect(course.materialsNeeded).toBeNull();
        });
    });

    describe("getList function", () => {
        test("should retrieve a list of courses", async () => {
            // Get list of courses
            const courses = await service.getList();

            // Expect list to have one course
            expect(courses).toHaveLength(1);

            // Get first course from list
            const firstCourse = courses[0];

            // Expect course to match course created earlier
            expect(firstCourse.userId).toBe(course.userId);
            expect(firstCourse.title).toBe(course.title);
            expect(firstCourse.description).toBe(course.description);
            expect(firstCourse.estimatedTime).toBe(course.estimatedTime);
            expect(firstCourse.materialsNeeded).toBe(course.materialsNeeded);

            // Expect course user data to match user created earlier
            expect(firstCourse.user.firstName).toBe(user.firstName);
            expect(firstCourse.user.lastName).toBe(user.lastName);
            expect(firstCourse.user.emailAddress).toBe(user.emailAddress);
        });
    });

    describe("getById function", () => {
        test("should retrieve one course by its ID", async () => {
            // Get course by ID
            const testCourse = await service.getById(course.id);

            // Expect course to match course created earlier
            expect(testCourse.userId).toBe(course.userId);
            expect(testCourse.title).toBe(course.title);
            expect(testCourse.description).toBe(course.description);
            expect(testCourse.estimatedTime).toBe(course.estimatedTime);
            expect(testCourse.materialsNeeded).toBe(course.materialsNeeded);

            // Expect course user data to match user created earlier
            expect(testCourse.user.firstName).toBe(user.firstName);
            expect(testCourse.user.lastName).toBe(user.lastName);
            expect(testCourse.user.emailAddress).toBe(user.emailAddress);
        });
    });

    describe("update function", () => {
        test("should update an existing course", async () => {
            // Define update course data
            const updatedCourseData = {
                estimatedTime: "FOREVER",
                materialsNeeded: "FUN FUN FUN FUN FUN FUN",
            };

            // Update course
            const updatedCourse = await service.update(course, updatedCourseData);

            // Expect data not specified on update data to equal older course data
            expect(updatedCourse.title).toBe(course.title);
            expect(updatedCourse.description).toBe(course.description);
            expect(updatedCourse.userId).toBe(course.userId);
            expect(updatedCourse.user.firstName).toBe(user.firstName);
            expect(updatedCourse.user.lastName).toBe(user.lastName);
            expect(updatedCourse.user.emailAddress).toBe(user.emailAddress);

            // Expect updated data to equal update input data
            expect(updatedCourse.estimatedTime).toBe(updatedCourseData.estimatedTime);
            expect(updatedCourse.materialsNeeded).toBe(updatedCourseData.materialsNeeded);

            // Store updated course for later tests
            course = updatedCourse;
        });
    });

    describe("delete function", () => {
        test("should delete a course", async () => {
            // Model expected getById error
            const expectedError = new Error(`Course not found with ID "${course.id}"`)
            expectedError.name = "NotFoundError";
            expectedError.status = 404;

            // Delete course
            await service.delete(user, course);

            // Expect rejection when trying to find course by ID
            expect(service.getById(course.id)).rejects.toEqual(expectedError);
        });
    });
});