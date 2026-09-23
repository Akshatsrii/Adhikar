import mongoose, { Schema, Document } from 'mongoose'

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId
  schemeId: string
  schemeName: string
  applicationId: string
  status: 'Under Review' | 'Approved' | 'Rejected' | 'Pending'
  appliedDate: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    schemeId: { type: String, required: true },
    schemeName: { type: String, required: true },
    applicationId: { type: String, required: true },
    status: { type: String, enum: ['Under Review', 'Approved', 'Rejected', 'Pending'], default: 'Under Review' },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const ApplicationModel = mongoose.model<IApplication>('Application', ApplicationSchema)
