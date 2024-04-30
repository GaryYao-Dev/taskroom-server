/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task and save it to the database.
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parent_project:
 *                 type: string
 *                 description: The ID of the parent project to which the task belongs.
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *               created_by:
 *                 type: string
 *                 description: The ID of the user who created the task. Should be obtained from req.user.id.
 *     responses:
 *       201:
 *         description: Task.id created successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Task created successfully"
 */
/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Get all tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       '200':
 *         description: Task found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksResponse'
 *       '500':
 *         description:  Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/tasks/{taskId}:
 *   get:
 *     summary: Get a single task
 *     description: Retrieve details about a specific task identified by its ID.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: taskId
 *         in: path
 *         description: ID of the task to retrieve
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Task found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       '500':
 *         description:  Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/tasks/{taskId}:
 *   patch:
 *     summary: update a task
 *     description: Get the existed task by using its id from database, and update its information.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: taskId
 *         in: path
 *         description: ID of the task to update
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/UpdateTask'
 *     responses:
 *       '200':
 *         description: Task updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       '204':
 *         description:  No Content.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/NoContentResponse'
 */
/**
 * @swagger
 * /api/v1/tasks/{taskId}:
 *   delete:
 *     summary: delete a task
 *     description: delete a task from the database.
 *     tags:
 *      - Tasks
 *     parameters:
 *      - name: taskId
 *        in: path
 *        description: ID of the task to delete
 *        required: true
 *        type: string
 *     responses:
 *      '500':
 *        description:  Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
