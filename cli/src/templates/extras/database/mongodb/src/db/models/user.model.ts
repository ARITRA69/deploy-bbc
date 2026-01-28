import { Schema, model, Document } from "mongoose";

/**
 * User interface for TypeScript
 */
export type User = {
  email: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User document interface (Mongoose Document + User)
 */
export type UserDocument = Document & User;

/**
 * User schema definition
 */
const user_schema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
    versionKey: false, // Disable __v field
  }
);

/**
 * Indexes for better query performance
 */
user_schema.index({ email: 1 });

/**
 * User model
 */
export const user_model = model<UserDocument>("User", user_schema);

// Example usage functions
/*
// Create a new user
export async function create_user(email: string, name: string) {
  const user = new user_model({ email, name });
  return await user.save();
}

// Find all users
export async function find_all_users() {
  return await user_model.find();
}

// Find user by ID
export async function find_user_by_id(id: string) {
  return await user_model.findById(id);
}

// Find user by email
export async function find_user_by_email(email: string) {
  return await user_model.findOne({ email });
}

// Update user
export async function update_user(id: string, data: Partial<User>) {
  return await user_model.findByIdAndUpdate(id, data, { new: true });
}

// Delete user
export async function delete_user(id: string) {
  return await user_model.findByIdAndDelete(id);
}
*/
