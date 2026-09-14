import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose'

const familyProfileSchema = new Schema(
  {
    age: { type: Number, min: 0, max: 120 },
    state: { type: String, trim: true },
    education: { type: String, trim: true },
    income: { type: Number, min: 0 },
    occupation: { type: String, trim: true },
  },
  { _id: false },
)

const familyMemberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    relation: {
      type: String,
      required: true,
      enum: ['spouse', 'child', 'parent', 'sibling', 'other'],
    },
    profile: { type: familyProfileSchema, default: {} },
  },
  { timestamps: true },
)

export type FamilyMember = InferSchemaType<typeof familyMemberSchema>
export type FamilyMemberDocument = HydratedDocument<FamilyMember>

export const FamilyMemberModel = model('FamilyMember', familyMemberSchema)
