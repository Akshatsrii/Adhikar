import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose'

const profileSchema = new Schema(
  {
    age: { type: Number, min: 0, max: 120 },
    dob: { type: String, trim: true },
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
      required: false, // Make email optional for phone-only logins
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    passwordHash: { type: String, required: false, select: false },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
    profile: { type: profileSchema, default: {} },
  },
  { timestamps: true },
)

export type User = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<User>

export const UserModel = model('User', userSchema)
