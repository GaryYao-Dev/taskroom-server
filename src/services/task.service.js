const TaskModel = require('../models/task.model');
const ColumnModel = require('../models/column.model');

const copyTask = async (task, userId, columnId = null) => {
  const copiedTask = await TaskModel.create({
    parent_column: columnId ?? task.parent_column,
    title: task.title,
    content: task.content,
    created_by: userId,
    created_at: new Date(),
  });

  !columnId &&
    (await ColumnModel.findByIdAndUpdate(task.parent_column, {
      $push: { tasks: copiedTask.id },
    }));
  return copiedTask;
};

module.exports = { copyTask };
