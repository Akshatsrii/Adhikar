import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose'

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    kind: {
      type: String,
      required: true,
      enum: ['eligibility_lost', 'eligibility_gained', 'documents_changed', 'deadline_changed'],
    },

    schemeSlug: { type: String, required: true },
    schemeName: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },

    // Link back to the approved RegulatoryChange in Postgres, so a citizen
    // asking "why did this change?" can be traced to the exact source.
    regulatoryChangeId: { type: Number },
    sourceUrl: { type: String },

    readAt: { type: Date, default: null },
  },
  { timestamps: true },
)

notificationSchema.index({ userId: 1, readAt: 1 })

export type Notification = InferSchemaType<typeof notificationSchema>
export type NotificationDocument = HydratedDocument<Notification>

export const NotificationModel = model('Notification', notificationSchema)
