import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose'

const profileSchema = new Schema(
  {
    age: { type: Number, min: 0, max: 120 },
    state: { type: String, trim: true },
    education: { type: String, trim: true },
    income: { type: Number, min: 0 },
    occupation: { type: String, trim: true },
  },
  { _id: false },
)

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
    profile: { type: profileSchema, default: {} },
  },
  { timestamps: true },
)

export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>

export const UserModel = model('User', userSchema)
