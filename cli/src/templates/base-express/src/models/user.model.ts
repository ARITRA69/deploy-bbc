import mongoose, { model, Schema } from "mongoose";
import { TUser } from "../types";

const user_schema = new Schema<TUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true }
  }, {
  timestamps: true
}
)


user_schema.index({ email: 1 })

export const User = mongoose.models.User || model<TUser>('User', user_schema, 'users') 