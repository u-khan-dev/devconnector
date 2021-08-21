import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter a name']
  },

  email: {
    type: String,
    required: [true, 'please enter an email'],
    unique: true
  },

  password: {
    type: String,
    required: [true, 'please enter a password']
  },

  avatar: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ user: { id: this._id } }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('user', UserSchema);

export default User;
