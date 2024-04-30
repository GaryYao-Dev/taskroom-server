const mongoose = require('mongoose');
const request = require('supertest');
const UserModel = require('../models/user.model');
const testApp = require('./test.app');
const dbLoader = require('../loaders/db');
const {
  
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
} = require('@jest/globals');
const jwt = require('../utils/jwt');

describe('User API', () => {
  beforeAll(async () => {
    dbLoader(process.env.MONGO_TEST_URI);
  });
  afterAll(async () => {
    await UserModel.deleteMany({});
    await mongoose.disconnect();
  });

  test('POST /api/v1/users should create a new user', async () => {
    const user = {
      username: 'User Test',
      email: 'PostTest@example.com',
      hashed_password: Math.random().toString(36).substring(7),
    };
    const response = await request(testApp)
      .post('/api/v1/users')
      .send(user)
      .expect(201);

    expect(response.body.message).toContain('created successfully');
    const savedUser = await UserModel.findById(
      response.body.message.split(' ')[0],
    );
    expect(savedUser.username.toString()).toEqual(user.username);
    expect(savedUser.email).toEqual(user.email);
    expect(savedUser.hashed_password).toEqual(user.hashed_password);
    await UserModel.findByIdAndDelete(savedUser.id);
  }, 10000);

  test('GET /api/v1/userusers should return all users', async () => {
    const users = [];
    for (let i = 1; i < 6; i++) {
      users.push({
        username: `User Test${i}`,
        email: `GetTest${i}@example.com`,
        hashed_password: Math.random().toString(36).substring(7),
      });
    }
    const newUsers = await UserModel.insertMany(users);
    const response = await request(testApp).get('/api/v1/users').expect(200);
    expect(response.body.length).toEqual(users.length);
    for (let i = 0; i < 5; i++) {
      expect(response.body[i].username).toEqual(
        newUsers[i].username.toString(),
      );
      expect(response.body[i].email).toEqual(newUsers[i].email);
      expect(response.body[i].hashed_password).toEqual(
        newUsers[i].hashed_password,
      );
    }
    await UserModel.deleteMany({ _id: { $in: newUsers.map((t) => t._id) } });
  }, 10000);

  test('GET /api/v1/users/:id should return a single user', async () => {
    const user = {
      username: 'User Test',
      email: 'GetByIdTest@example.com',
      hashed_password: Math.random().toString(36).substring(7),
    };
    const savedUser = await UserModel.create(user);
    console.log(savedUser.id);
    const token = jwt.generateToken(savedUser);

    const response = await request(testApp)
      .get(`/api/v1/users/${savedUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.username).toEqual(user.username);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.hashed_password).toEqual(user.hashed_password);
    await UserModel.findByIdAndDelete(savedUser.id);
  }, 10000);

  test('PATCH /api/v1/users/:id should update a user', async () => {
    const user = new UserModel({
      username: 'User Test',
      email: 'PatchTest@example.com',
      hashed_password: Math.random().toString(36).substring(7),
    });
    await user.save();

    const updatedUserData = {
      username: 'Updated Username',
      email: 'UpdatedTest@example.com',
      avatar_url: 'updatedAvatarURL',
    };

    await request(testApp)
      .patch(`/api/v1/users/${user._id}`)
      .send(updatedUserData)
      .expect(204);

    const updatedUser = await UserModel.findById(user._id);
    expect(updatedUser.username).toEqual(updatedUserData.username);
    expect(updatedUser.email).toEqual(updatedUserData.email);
    expect(updatedUser.avatar_url).toEqual(updatedUserData.avatar_url);
    await UserModel.findByIdAndDelete(updatedUser.id);
  });

  test('DELETE /api/v1/users/:id should delete a user', async () => {
    const user = new UserModel({
      username: 'User Test',
      email: 'DeleteTest@example.com',
      hashed_password: Math.random().toString(36).substring(7),
    });
    await user.save();

    const response = await request(testApp)
      .delete(`/api/v1/users/${user._id}`)
      .expect(200);

    expect(response.body.message).toContain('User deleted successfully');

    const deletedUser = await UserModel.findById(user._id);

    expect(deletedUser).toBeNull();
  });
  
  test('POST /api/v1/users should return 400 Bad Request if required fields are missing', async () => {
    const user = {
      username: 'User Test',
      // email is missing
      hashed_password: Math.random().toString(36).substring(7),
    };

    const response = await request(testApp).post('/api/v1/users').send(user);

    expect(response.status).toEqual(400);
    expect(response.body.error).toContain('ValidationError');
  });

  test('GET /api/v1/users/:id should return 401 Unauthorized if user have no token', async () => {
    const user = {
      username: 'User Test',
      email: 'GetByIdTest@example.com',
      hashed_password: Math.random().toString(36).substring(7),
    };
    const savedUser = await UserModel.create(user);
    console.log(savedUser.id);
    await request(testApp)
      .get(`/api/v1/users/${savedUser.id}`)
      .expect(401);
    await UserModel.findByIdAndDelete(user.id);
  });

  test('PATCH /api/v1/users/:id should return 404 Resource not found if user is not found', async () => {
    const nonExistingUserId = '64c4b1d8806e6b61c746d4f9';
    const updatedUserData = {
      username: 'Updated Username',
      email: 'UpdatTest@example.com',
      avatar_url: 'updatedAvatarURL',
    };

    const response = await request(testApp)
      .patch(`/api/v1/users/${nonExistingUserId}`)
      .send(updatedUserData)
      .expect(404);

    expect(response.body.error).toContain('Resource not found');
  });

  test('PATCH /api/v1/users/:id should return 400 Bad Request for ValidationError', async () => {
    const user = new UserModel({
      username: 'User Test',
      email: 'PatchTestNew@example.com',
      hashed_password: Math.random().toString(36).substring(7),
    });
    await user.save();

    const updatedUserData = {
      username: 'nn', //ValidationError with string shorter than 3
    };

    const response = await request(testApp)
      .patch(`/api/v1/users/${user._id}`)
      .send(updatedUserData)
      .expect(400);

    expect(response.body.error).toContain('ValidationError');
    await UserModel.findByIdAndDelete(user.id);
  });

  test('DELETE /api/v1/users/:id should return 404 Resource not found if user is not found', async () => {
    const nonExistingUserId = '64c4b1d8806e6b61c746d4f9';
    const response = await request(testApp)
      .delete(`/api/v1/users/${nonExistingUserId}`)
      .expect(404);

    expect(response.body.error).toContain('Resource not found');
  });
});