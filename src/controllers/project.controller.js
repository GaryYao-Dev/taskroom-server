const ProjectModel = require('../models/project.model');
const NotFoundError = require('../errors/not.found');
const logger = require('../utils/logger');
const UserModel = require('../models/user.model');
const { verifyToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const deleteProject = require('../services/project.service');

const postProject = async (req, res, next) => {
  try {
    const { name, backgroundColor } = req.body;
    const project = new ProjectModel({
      name,
      created_by: req.user.id,
      background_color: backgroundColor + '2b',
    });
    await project.save();
    await UserModel.findByIdAndUpdate(req.user.id, {
      $push: { owned_projects: project.id },
    }).exec();
    res.status(201).json(project);
    logger.info(`Project ${project.id} created sufccessfully`);
  } catch (error) {
    next(error);
    logger.error(`Error while creating project: ${error.message}`);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await ProjectModel.find();
    res.json(projects);
    logger.info(`Retrieved ${projects.length} projects`);
  } catch (error) {
    next(error);
    logger.error(`Error while fetching projects: ${error.message}`);
  }
};

const getProjectById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.findById(id);
    if (!project) {
      throw new NotFoundError(`Project ${id} not found`);
    }
    res.json(project);
    logger.info(`Project ${id} retrieved successfully`);
  } catch (error) {
    next(error);
    logger.error(`Error while fetching project ${id}: ${error.message}`);
  }
};

const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const { name, profile, created_by, members, columns, backgroundColor } =
    req.body;

  try {
    await ProjectModel.findByIdAndUpdate(id, {
      name,
      profile,
      created_by,
      members,
      columns,
      background_color: backgroundColor,
    }).exec();
    res.status(204).send();
    logger.info(`Project ${id} updated successfully`);
  } catch (error) {
    next(error);
    logger.error(`Error while updating project ${id}: ${error.message}`);
  }
};

const deleteProjectById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    await deleteProject(id, userId);
    res.status(200).json({ message: 'Project deleted successfully' });
    logger.info(`Project ${id} deleted successfully`);
  } catch (error) {
    next(error);
    logger.info(`Error while deleting project ${id}: ${error.message}`);
  }
};

const getProjectDataById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.findById(id).populate({
      path: 'columns',
      select: 'name tasks',
      populate: {
        path: 'tasks',
        select: 'title',
      },
    });
    if (!project) {
      throw new NotFoundError(`Project ${id} not found`);
    }
    res.json(project);
    logger.info(`Project ${id} retrieved successfully`);
  } catch (error) {
    next(error);
    logger.error(`Error while fetching project ${id}: ${error.message}`);
  }
};

const generateInviteLink = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.findById(id);
    if (!project) {
      throw new NotFoundError(`Project ${id} not found`);
    }
    console.log({ projectId: project.id });
    const token = jwt.sign({ projectId: project.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    console.log(verifyToken(token));

    const inviteLink = `${req.headers.origin}/join/${token}`;
    res.json({ inviteLink });
    logger.info(`Invite link for project ${id} generated successfully`);
  } catch (error) {
    next(error);
    logger.error(
      `Error while generating invite link for project ${id}: ${error.message}`,
    );
  }
};

const joinProject = async (req, res, next) => {
  const { token } = req.body;
  const { projectId } = verifyToken(token);
  console.log(verifyToken(token));
  try {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Project ${projectId} not found`);
    }
    const user = req.user;

    if (project.members.includes(user.id)) {
      res
        .status(208)
        .json({ message: 'You are in project already', projectId: project.id });
      return;
    }
    console.log(project.created_by, user.id);
    if (project.created_by.toString() === user.id) {
      res.status(208).json({
        message: 'You are the owner of this project',
        projectId: project.id,
        projectTitle: project.name,
      });
      return;
    }

    project.members.push(user.id);
    await project.save();

    user.joined_projects.push(project.id);
    await user.save();

    res.json({ projectId: project.id, projectTitle: project.name });
  } catch (error) {
    next(error);
    logger.error(
      `Error while generating invite link for project ${projectId}: ${error.message}`,
    );
  }
};

module.exports = {
  postProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProjectById,
  getProjectDataById,
  generateInviteLink,
  joinProject,
};
