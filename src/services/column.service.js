const ColumnModel = require('../models/column.model');
const ProjectModel = require('../models/project.model');
const TaskModel = require('../models/task.model');
const { copyTask: copyTaskService } = require('../services/task.service');

const sortArray = (array, key, order) => {
  if (key === 'created_at' || key === 'due_at') {
    if (order === 'ascend') {
      return array.sort((a, b) => new Date(a[key]) - new Date(b[key]));
    }
    return array.sort((a, b) => new Date(b[key]) - new Date(a[key]));
  }
  const sortFunc = (a, b) => {
    if (a[key].toLowerCase() < b[key].toLowerCase()) {
      return -1;
    }
    if (a[key].toLowerCase() > b[key].toLowerCase()) {
      return 1;
    }
    return 0;
  };

  if (order === 'ascend') {
    return array.sort(sortFunc);
  }
  return array.sort(sortFunc).reverse();
};

const sortTasks = async (columnId, type, order) => {
  const column = await ColumnModel.findById(columnId).populate('tasks');
  const sortedTasks = sortArray(column.tasks, type, order);
  return await ColumnModel.findByIdAndUpdate(
    columnId,
    {
      tasks: sortedTasks.map((task) => task.id),
    },
    { new: true },
  );
};

const copyColumn = async (columnId, userId) => {
  const column = await ColumnModel.findById(columnId).populate('tasks');
  const newColumn = new ColumnModel({
    name: column.name,
    parent_project: column.parent_project,
    tasks: [],
  });
  await newColumn.save();
  await ProjectModel.findByIdAndUpdate(column.parent_project, {
    $push: { columns: newColumn.id },
  });
  const copiedTasks = await Promise.all(
    column.tasks.map((task) => copyTaskService(task, userId, newColumn.id)),
  );
  const updatedColumn = await ColumnModel.findByIdAndUpdate(
    newColumn.id,
    {
      tasks: copiedTasks.map((task) => task.id),
    },
    { new: true },
  ).populate({
    path: 'tasks',
    select: 'title',
  });
  return updatedColumn;
};

const deleteTasks = async (columnId) => {
  const column = await ColumnModel.findById(columnId).populate('tasks');
  const tasks = column.tasks.map((task) => task.id);
  await ColumnModel.findByIdAndUpdate(columnId, { tasks: [] }, { new: true });
  await TaskModel.deleteMany({ _id: { $in: tasks } });
};

module.exports = { sortTasks, copyColumn, deleteTasks };
