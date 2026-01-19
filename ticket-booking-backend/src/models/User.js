import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite issues in serverless / hot-reload environments
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
