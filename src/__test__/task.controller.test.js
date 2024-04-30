const mongoose = require('mongoose');
const request = require('supertest');
const TaskModel = require('../models/task.model');
const testApp = require('./test.app');
const dbLoader = require('../loaders/db');
const {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
} = require('@jest/globals');

describe('Task API', () => {
  beforeAll(async () => {
    dbLoader(process.env.MONGO_TEST_URI);
  });
  afterAll(async () => {
    await TaskModel.deleteMany({});
    await mongoose.disconnect();
  });

  test('POST /api/v1/tasks should create a new task', async () => {
    const task = {
      parent_column: '64d72935d15ea60ee7c7e30f',
      title: 'Task PostTest',
      created_by: 'user PostTest',
    };
    const response = await request(testApp)
      .post('/api/v1/tasks')
      .send(task)
      .expect(201);

    expect(response.body.message).toContain('created successfully');
    const savedTask = await TaskModel.findById(
      response.body.message.split(' ')[0],
    );
    expect(savedTask.parent_column.toString()).toEqual(task.parent_column);
    expect(savedTask.title).toEqual(task.title);
    expect(savedTask.created_by).toEqual(task.created_by);
    await TaskModel.findByIdAndDelete(savedTask.id);
  }, 15000);

  test('GET /api/v1/tasks should return all tasks', async () => {

    const tasks = [];
    for (let i = 1; i < 6; i++) {
      tasks.push({
        parent_column: '64d72935d15ea60ee7c7e30f',
        title: `Task GetAllTest${i}`,
        created_by: `user GetAllTest${i}`,
      });
    }
    const newTasks = await TaskModel.insertMany(tasks);
    const response = await request(testApp).get('/api/v1/tasks').expect(200);
    expect(response.body.length).toEqual(tasks.length);
    for (let i = 0; i < 5; i++) {
      expect(response.body[i].parent_column).toEqual(
        newTasks[i].parent_column.toString(),
      );
      expect(response.body[i].title).toEqual(newTasks[i].title);
      expect(response.body[i].created_by).toEqual(newTasks[i].created_by);
    }
    await TaskModel.deleteMany({ _id: { $in: newTasks.map((t) => t._id) } });
  });

  test('GET /api/v1/tasks/:id should return a single task', async () => {
    const task = new TaskModel({
      parent_column: '64d72935d15ea60ee7c7e30f',
      title: 'Task GetByIdTest',
      created_by: 'user GetByIdTest',
    });
    const savedTask = await task.save();

    const response = await request(testApp)
      .get(`/api/v1/tasks/${task._id}`)
      .expect(200);

    // expect(response.body.parent_column).toEqual(task.parent_column);
    expect(response.body.title).toEqual(task.title);
    expect(response.body.created_by).toEqual(task.created_by);
    await TaskModel.findByIdAndDelete(savedTask.id);
  });

  test('PATCH /api/v1/tasks/:id should update a task', async () => {
    const task = new TaskModel({
      parent_column: '64d72935d15ea60ee7c7e30f',
      title: 'Task 1',
      created_by: 'user1',
    });
    await task.save();

    const updatedTaskData = {
      title: 'Updated Task Title',
      content: 'Updated Task Content',
      created_by: 'user2',
      assigned_to: '64c26de6d5351a0d05b7c5bb',
      comment: '64c26de6d5351a0d05b7c5c0',
      due_at: new Date(),
      status: 'in_progress',
    };

    await request(testApp)
      .patch(`/api/v1/tasks/${task._id}`)
      .send(updatedTaskData)
      .expect(204);

    const updatedTask = await TaskModel.findById(task._id);

    expect(updatedTask.title).toEqual(updatedTaskData.title);
    expect(updatedTask.content).toEqual(updatedTaskData.content);
    expect(updatedTask.created_by).toEqual(updatedTaskData.created_by);
    expect(updatedTask.assigned_to.toString()).toEqual(
      updatedTaskData.assigned_to,
    );
    expect(updatedTask.due_at.toISOString()).toEqual(
      updatedTaskData.due_at.toISOString(),
    );
    expect(updatedTask.comment.toString()).toEqual(updatedTaskData.comment);

    // expect(updatedTask.status).toEqual(updatedTaskData.status);
    await TaskModel.findByIdAndDelete(updatedTask.id);
  });

  test('DELETE /api/v1/tasks/:id should delete a task', async () => {
    const task = new TaskModel({
      parent_column: '64d72935d15ea60ee7c7e30f',
      title: 'Task DeleteTest',
      created_by: 'user DeleteTest',
    });
    await task.save();

    const response = await request(testApp)
      .delete(`/api/v1/tasks/${task._id}`)
      .expect(200);

    expect(response.body.message).toContain('Task deleted successfully');

    const deletedTask = await TaskModel.findById(task._id);

    expect(deletedTask).toBeNull();
  });
  test('POST /api/v1/tasks should return 400 Bad Request if required fields are missing', async () => {
    const task = {
      parent_column: '64d72935d15ea60ee7c7e30f',
      // title is missing
      created_by: 'user1',
    };

    const response = await request(testApp)
      .post('/api/v1/tasks')
      .send(task);

    expect(response.status).toEqual(400);
    expect(response.body.error).toContain('ValidationError');
  });

  test('GET /api/v1/tasks/:id should return 404 Resource not found if task is not found', async () => {
    const nonExistingTaskId = '60f5c5e0c0e6a31f6c8a7f00';
    const response = await request(testApp)
      .get(`/api/v1/tasks/${nonExistingTaskId}`)
      .expect(404);

    expect(response.body.error).toContain('Resource not found');
  });

  test('PATCH /api/v1/tasks/:id should return 404 Resource not found if task is not found', async () => {
    const nonExistingTaskId = '60f5c5e0c0e6a31f6c8a7f00';
    const updatedTaskData = {
      title: 'Updated Task Title',
      content: 'Updated Task Content',
      created_by: 'user2',
      assigned_to: '64c26de6d5351a0d05b7c5bb',
      comment: '64c26de6d5351a0d05b7c5c0',
      due_at: new Date(),
      status: 'in_progress',
    };

    const response = await request(testApp)
      .patch(`/api/v1/tasks/${nonExistingTaskId}`)
      .send(updatedTaskData)
      .expect(404);

    expect(response.body.error).toContain('Resource not found');
  });

  test('PATCH /api/v1/tasks/:id should return 400 Bad Request if format of required fields are wrong', async () => {
    const task = new TaskModel({
      parent_column: '64d72935d15ea60ee7c7e30f',
      title: 'Updated Task Title',
      created_by: 'user2',
    });
    await task.save();

    const updatedTaskData = {
      assigned_to: '64c26de6d5351a', //CastError with wrong id
    }

    const response = await request(testApp)
      .patch(`/api/v1/tasks/${task._id}`)
      .send(updatedTaskData)
      .expect(400);

    expect(response.body.error).toContain('CastError');
    await TaskModel.findByIdAndDelete(task.id);
  });

  test('PATCH /api/v1/tasks/:id should return 400 Bad Request for ValidationError', async () => {
    const task = new TaskModel({
      parent_column: '64d72935d15ea60ee7c7e30f',
      title: 'Updated Task Title',
      created_by: 'user2',
    });
    await task.save();

    const updatedTaskData = {
      title: 'Ti', //ValidationError with string shorter than 3
    }

    const response = await request(testApp)
      .patch(`/api/v1/tasks/${task._id}`)
      .send(updatedTaskData)
      .expect(400);

    expect(response.body.error).toContain('ValidationError');
    // await TaskModel.findByIdAndDelete(task.id);
  });



  test('DELETE /api/v1/tasks/:id should return 404 Resource not found if task is not found', async () => {
    const nonExistingTaskId = '60f5c5e0c0e6a31f6c8a7f00';
    const response = await request(testApp)
      .delete(`/api/v1/tasks/${nonExistingTaskId}`)
      .expect(404);

    expect(response.body.error).toContain('Resource not found');
  });
});
