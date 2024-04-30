
/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         parent_project:
 *           type: string
 *           description: The ID of the project that the task belongs to. It should be of ObjectID type, but for testing purposes, we're using a string.
 *           example: "60a8f1b4f3c1e5d8c3e3b1e7"
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done]
 *           default: todo
 *           description: The status of the task. It should be an enum type.
 *         title:
 *           type: string
 *           required: true
 *           minLength: 3
 *           maxLength: 30
 *           description: The title of the task.
 *           example: "Complete OpenAPI Documentation Generation"
 *         content:
 *           type: string
 *           description: The content of the task.
 *         created_by:
 *           type: string
 *           required: true
 *           description: The ID of the user who created the task. It should be of ObjectID type, but for testing purposes, we're using a string.
 *           example: "60a8f1b4f3c1e5d8c3e3b1e7"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The time when the task was created.
 *         last_modified_at:
 *           type: string
 *           format: date-time
 *           description: The time when the task was last modified.
 *         due_at:
 *           type: string
 *           format: date-time
 *           description: The due time of the task. It defaults to one week after the creation time.
 *         assigned_to:
 *           type: string
 *           description: The ID of the user to whom the task is assigned. It should be of ObjectID type.
 *         comment:
 *           type: string
 *           description: The ID of the comment related to the task. It should be of ObjectID type.
 *     UpdateTask:
 *       type: object
 *       properties:
 *         parent_project:
 *           type: string
 *           description: The ID of the project to which the task belongs.
 *         title:
 *           type: string
 *           description: The title of the task.
 *         created_by:
 *           type: string
 *           description: The ID of the user who created the task. Should be obtained from req.user.id
 *     TaskResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the task.
 *         parent_project:
 *           type: string
 *           description: The ID of the parent project to which the task belongs.
 *         title:
 *           type: string
 *           description: The title of the task.
 *         created_by:
 *           type: string
 *           description: The ID of the user who created the task. Should be obtained from req.user.id
 *     TasksResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/TaskResponse'
 *     NoContentResponse:
 *       type: object
 *       properties:
 *         massage:
 *           type: string
 *           description: No content has been found or added into the database.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message.
 */