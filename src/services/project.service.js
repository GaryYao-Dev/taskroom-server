const ProjectModel = require('../models/project.model');
const ColumnModel = require('../models/column.model');
const TaskModel = require('../models/task.model');
const UserModel = require('../models/user.model');
const NotFoundError = require('../errors/not.found');
const mongoose = require('mongoose');

const deleteProject = async (id, userId) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const project = await ProjectModel.findById(id)
      .populate({
        path: 'columns',
        populate: {
          path: 'tasks',
        },
      })
      .session(session);

    if (!project) {
      throw new NotFoundError(`Project ${id} not found`);
    }
    const columns = project.columns;
    const columnIds = columns.map((column) => column.id);
    const taskIds = columns
      .map((column) => column.tasks.map((task) => task.id))
      .flat();

    await TaskModel.deleteMany({ _id: { $in: taskIds } }).session(session);
    await ColumnModel.deleteMany({ _id: { $in: columnIds } }).session(session);
    await ProjectModel.findByIdAndDelete(id).session(session);
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { owned_projects: id },
    }).session(session);
    project.members.forEach(async (memberId) => {
      await UserModel.findByIdAndUpdate(memberId, {
        $pull: { joined_projects: id },
      }).session(session);
    });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = deleteProject;
