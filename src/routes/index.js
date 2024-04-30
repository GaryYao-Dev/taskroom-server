const express = require('express');
const tasksRouter = require('./tasks.route');
const usersRouter = require('./users.route');
const columnsRouter = require('./columns.route');
const projectRouter = require('./projects.route');
const authRouter = require('./auth.routes');

const v1Router = express.Router();

v1Router.use('/tasks', tasksRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/columns', columnsRouter);
v1Router.use('/projects',projectRouter);
v1Router.use('/auth',authRouter)

module.exports = v1Router;
