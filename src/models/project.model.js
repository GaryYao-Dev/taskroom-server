const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  profile: {
    default: 'This is a new project.',
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  columns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
    },
  ],
});

projectSchema.virtual('id').get(function () {
  if (this._id) {
    return this._id.toHexString();
  }
});

projectSchema.set('toJSON', {
  virtuals: true,
});

const ProjectModel = mongoose.model('Project', projectSchema);
module.exports = ProjectModel;
