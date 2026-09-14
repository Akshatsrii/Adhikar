import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose'

const lifeEventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rawText: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      required: true,
      enum: [
        'MARRIAGE',
        'CHILDBIRTH',
        'GRADUATION',
        'JOB_LOSS',
        'NEW_JOB',
        'RETIREMENT',
        'RELOCATION',
        'UNKNOWN',
      ],
    },
    confidence: { type: Number, min: 0, max: 1, required: true },
    suggestedCategories: { type: [String], default: [] },
  },
  { timestamps: true },
)

export type LifeEvent = InferSchemaType<typeof lifeEventSchema>
export type LifeEventDocument = HydratedDocument<LifeEvent>

export const LifeEventModel = model('LifeEvent', lifeEventSchema)
