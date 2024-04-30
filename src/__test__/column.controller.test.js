const mongoose = require('mongoose');
const request = require('supertest');
const columnModel = require('../models/column.model');
const testApp = require('./test.app');
const dbLoader = require('../loaders/db');
const {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
} = require('@jest/globals');

describe('Column API', () => {
  beforeAll(async () => {
    dbLoader(process.env.MONGO_TEST_URI);
  });
  afterAll(async () => {
    await columnModel.deleteMany({});
    await mongoose.disconnect();
  });

  //POST
  test('POST /api/v1/columns should create a new column', async () => {
    const columnBody = {
      name: 'Column PostTest',
      parent_project: '64d72935d15ea60ee7c7e30f',
    };

    const response = await request(testApp)
      .post('/api/v1/columns')
      .send(columnBody)
      .expect(200);

    expect(response.body.name).toEqual(columnBody.name);
    expect(response.body.parent_project).toEqual(columnBody.parent_project);

    await columnModel.findByIdAndDelete(response.body.id);
  });
  //POST Error
  test('POST /api/v1/columns should return 400 if name is missing', async () => {
    const columnBody = {
      parent_project: '64d72935d15ea60ee7c7e30f',
    };

    const response = await request(testApp)
      .post('/api/v1/columns')
      .send(columnBody)
      .expect(400);

    expect(response.body.message).toContain(
      'Column validation failed: name: Path `name` is required.',
    );
  });

  //GET
  test('GET /api/v1/columns should return all columns', async () => {
    const columns = [];
    for (let i = 1; i < 6; i++) {
      columns.push({
        name: `Column GetAllTest${i}`,
        parent_project: '64d72935d15ea60ee7c7e30f',
      });
    }
    const newColumns = await columnModel.insertMany(columns);
    const response = await request(testApp).get('/api/v1/columns').expect(200);
    expect(response.body.length).toEqual(columns.length);
    for (let i = 0; i < 5; i++) {
      expect(response.body[i].name).toEqual(newColumns[i].name);
      expect(response.body[i].parent_project).toEqual(
        newColumns[i].parent_project.toString(),
      );
    }
    await columnModel.deleteMany({
      _id: { $in: newColumns.map((t) => t._id) },
    });
  });

  //GET BY ID
  test('GET /api/v1/columns/:id should return a single column', async () => {
    const column = new columnModel({
      name: 'Column GetByIdTest',
      parent_project: '64d72935d15ea60ee7c7e30f',
    });
    await column.save();

    const response = await request(testApp)
      .get(`/api/v1/columns/${column._id}`)
      .expect(200);

    expect(response.body.name).toEqual(column.name);
    expect(response.body.parent_project).toEqual(
      column.parent_project.toString(),
    );

    await columnModel.findByIdAndDelete(column.id);
  });
  //GET BY ID Error
  test('GET /api/v1/columns/:id should return 404 if column not found', async () => {
    const response = await request(testApp)
      .get('/api/v1/columns/64d72935d15ea60ee7c7e30f')
      .expect(404);

    expect(response.body.message).toContain(
      'ColumnId 64d72935d15ea60ee7c7e30f not found',
    );
  });

  //PATCH
  test('PATCH /api/v1/columns/:id should update a column', async () => {
    const column = new columnModel({
      name: 'Column PatchTest',
      parent_project: '64d72935d15ea60ee7c7e30f',
    });
    await column.save();

    await request(testApp)
      .patch(`/api/v1/columns/${column._id}`)
      .send({ name: 'Column PatchTest Updated' })
      .expect(204);

    const updatedColumn = await columnModel.findById(column._id);
    expect(updatedColumn.name).toEqual('Column PatchTest Updated');
    await columnModel.findByIdAndDelete(column.id);
  });

  //PATCH Error
  test('PATCH /api/v1/columns/:id should return 400 for validation error', async () => {
    const column = new columnModel({
      name: 'Column PatchTest',
      parent_project: '64d72935d15ea60ee7c7e30f',
    });
    await column.save();

    const response = await request(testApp)
      .patch(`/api/v1/columns/${column._id}`)
      .send({ name: '123456789101234567891012345678910' })
      .expect(400);

    expect(response.body.message).toContain(
      'than the maximum allowed length',
    );
    await columnModel.findByIdAndDelete(column.id);
  });

  //DELETE
  test('DELETE /api/v1/columns/:id should delete a column', async () => {
    const column = new columnModel({
      name: 'Column DeleteTest',
      parent_project: '64d72935d15ea60ee7c7e30f',
    });

    await column.save();

    await request(testApp)
      .delete(`/api/v1/columns/${column._id}`)
      .expect(204);

    await request(testApp)
      .get(`/api/v1/columns/${column._id}`)
      .expect(404);

  });
  //DELETE Error
  test('DELETE /api/v1/columns/:id should return 404 if column not found', async () => {
    const response = await request(testApp)
      .delete('/api/v1/columns/64d72935d15ea60ee7c7e30f')
      .expect(404);

    expect(response.body.message).toContain(
      'ColumnId 64d72935d15ea60ee7c7e30f not found',
    );
  });
});
