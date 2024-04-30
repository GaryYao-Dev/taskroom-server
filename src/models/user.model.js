const { Schema, model } = require('mongoose');
// use joi to validate user input
const Joi = require('joi');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {
        validator: (email) => {
          return Joi.string().email().validate(email).error === undefined;
          // return false -> invalid, return true -> valid
        },
        msg: 'Invalid email format',
      },
    ],
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  hashed_password: {
    type: String,
    required: true,
    validate: [],
  },
  salt: {
    type: String,
    // from db or controller?
  },
  avatar_url: {
    type: String,
    // default:
  },
  owned_projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
  owned_tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  joined_projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
  joined_tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

const UserModel = model('User', userSchema);

module.exports = UserModel;
