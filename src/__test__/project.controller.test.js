const mongoose = require('mongoose');
const request = require('supertest');
const ProjectModel = require('../models/project.model');
const testApp = require('./test.app');
const dbLoader = require('../loaders/db');
const {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
} = require('@jest/globals');

describe('Project API', () => {
  beforeAll(async () => {
    dbLoader(process.env.MONGO_TEST_URI);
  });
  afterAll(async () => {
    await ProjectModel.deleteMany({});
    await mongoose.disconnect();
  });

  //POST
  test('POST /api/v1/projects should create a new project', async () => {
    const project = {
    name: 'ProjectName Test',
    profile: 'Profile PostTest',
    created_by: 'User PostTest',
    };
    const response = await request(testApp)
      .post('/api/v1/projects')
      .send(project)
      .expect(201);

    expect(response.body.message).toContain('created successfully');
    const savedProject = await ProjectModel.findById(
      response.body.message.split(' ')[0],
    );
    expect(savedProject.name).toEqual(project.name);
    expect(savedProject.profile).toEqual(project.profile);
    expect(savedProject.created_by).toEqual(project.created_by);
    await ProjectModel.findByIdAndDelete(savedProject.id);
  });

  //GET
  test('GET /api/v1/projects should return all projects', async () => {

    const projects = [];
    for (let i = 1; i < 6; i++) {
        projects.push({
            name: `ProjectName GetAllTest${i}`,
            profile: `Profile GetAllTest${i}`,
            created_by: `user GetAllTest${i}`,
      });
    }
    const newProjects = await ProjectModel.insertMany(projects);
    const response = await request(testApp).get('/api/v1/projects').expect(200);
    expect(response.body.length).toEqual(projects.length);
    for (let i = 0; i < 5; i++) {
      expect(response.body[i].name).toEqual(newProjects[i].name);
      expect(response.body[i].profile).toEqual(newProjects[i].profile);
      expect(response.body[i].created_by).toEqual(newProjects[i].created_by);
    }
    await ProjectModel.deleteMany({ _id: { $in: newProjects.map((t) => t._id) } });
  });

  //GET BY ID
  test('GET /api/v1/projects/:id should return a single project', async () => {
    const project = new ProjectModel({
        name: 'ProjectName GetByIdTest',
        profile: 'Profile GetByIdTest',
        created_by: 'user GetByIdTest',
    });
    const savedProject = await project.save();

    const response = await request(testApp)
      .get(`/api/v1/projects/${project._id}`)
      .expect(200);

    expect(response.body.name).toEqual(project.name);
    expect(response.body.profile).toEqual(project.profile);
    expect(response.body.created_by).toEqual(project.created_by);
    await ProjectModel.findByIdAndDelete(savedProject.id);
  });

  //PATCH
  test('PATCH /api/v1/projects/:id should update a project', async () => {
    const project = new ProjectModel({
        name: 'ProjectTest 01',
        profile: 'Project Profile 01',
        created_by: 'user 01',
    });
    await project.save();

    const updatedProjectData = {
        name: 'Updated Project name',
        profile: 'Updated Project profile',
      created_by: 'user 02',
    };

    await request(testApp)
      .patch(`/api/v1/projects/${project._id}`)
      .send(updatedProjectData)
      .expect(204);

    const updatedProject = await ProjectModel.findById(project._id);

    expect(updatedProject.name).toEqual(updatedProjectData.name);
    expect(updatedProject.profile).toEqual(updatedProjectData.profile);
    expect(updatedProject.created_by).toEqual(updatedProjectData.created_by);

    await TaskModel.findByIdAndDelete(updatedProject.id);
  });

  //DELETE
  test('DELETE /api/v1/projects/:id should delete a project', async () => {
    const project = new ProjectModel({
        name: 'ProjectName DeleteTest',
        profile: 'Project DeleteTest',
        created_by: 'User DeleteTest',
    });
    await project.save();

    const response = await request(testApp)
      .delete(`/api/v1/projects/${project._id}`)
      .expect(200);

    expect(response.body.message).toContain('Project deleted successfully');

    const deletedProject = await ProjectModel.findById(project._id);

    expect(deletedProject).toBeNull();
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
