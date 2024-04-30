const NotFoundError = require('../errors/not.found');
const UserModel = require('../models/user.model');

const logger = require('../utils/logger'); // Create the logger instance

const postUser = async (req, res, next) => {
  try {
    const { username, email, hashed_password } = req.body;
    const user = new UserModel({
      username,
      email,
      hashed_password,
    });
    await user.save();
    res.status(201).json({ message: `${user.id} created successfully` });
    logger.info(`User ${user.id} created successfully`);
  } catch (error) {
    next(error);
    logger.error(`Error while creating task: ${error.message}`);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.json(users);
    // Log the number of users retrieved
    logger.info(`Retrieved ${users.length} tasks`);
  } catch (error) {
    next(error);
    logger.error(`Error while fetching tasks: ${error.message}`);
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new NotFoundError(`User ID ${id} not found`);
    }
    res.json(user);

    // Log the user retrieval
    logger.info(`User ${id} retrieved successfully`);
  } catch (error) {
    next();
    // logger.error(`Error while fetching user ${id}: ${error.message}`);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { username, email, avatar_url } = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        username,
        email,
        avatar_url,
      },
      { runValidators: true },
    ).exec();
    if (!user) {
      throw new NotFoundError(`UserId ${id} not found`);
    }
    res.status(204).send();

    // Log successful update
    logger.info(`User ${id} updated successfully`);
  } catch (error) {
    next(error);
    logger.error(`Error while updating user ${id}: ${error.message}`);
  }
};

//delete User by id
const deleteUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundError(`UserId ${id} not found`);
    }
    res.json({ message: 'User deleted successfully' });
    // Log successful deletion
    logger.info(`User ${id} deleted successfully`);
  } catch (error) {
    next(error);
    logger.error(`Error while deleting user ${id}: ${error.message}`);
  }
};

const getUserProfile = async (req, res, next) => {
  const user = req.user;
  try {
    res.json(user);
    // Log successful retrieval
    logger.info(`User ${user.id} retrieved successfully`);
  } catch (error) {
    next(error);
    logger.error(`Error while fetching user ${user.id}: ${error.message}`);
  }
};

const getProjectsForUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const { owned_projects } = await UserModel.findById(userId)
      .populate('owned_projects')
      .exec();
    const { joined_projects } = await UserModel.findById(userId)
      .populate('joined_projects')
      .exec();
    const projects = {};
    const array = [...owned_projects, ...joined_projects];
    array.forEach((project) => {
      const { columns, created_by, created_at, members, name, profile } =
        project;
      projects[project.id] = {
        columns,
        created_by,
        created_at,
        members,
        name,
        profile,
      };
    });
    res.json(projects);
    // Log successful retrieval
    logger.info(
      `${
        Object.keys(projects).length
      }Projects for user ${userId} retrieved successfully`,
    );
  } catch (error) {
    next(error);
    logger.error(
      `Error while fetching projects for user ${userId}: ${error.message}`,
    );
  }
};
module.exports = {
  postUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
  getUserProfile,
  getProjectsForUser,
};
