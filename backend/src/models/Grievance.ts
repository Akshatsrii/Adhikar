import mongoose, { Schema, Document } from 'mongoose'

export interface IGrievance extends Document {
  user: mongoose.Types.ObjectId
  subject: string
  description: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  category: 'Scheme Application' | 'Portal Issue' | 'Document Verification' | 'Other'
  createdAt: Date
}

const GrievanceSchema = new Schema<IGrievance>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Scheme Application', 'Portal Issue', 'Document Verification', 'Other'], default: 'Other' },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  },
  { timestamps: true }
)

export const GrievanceModel = mongoose.model<IGrievance>('Grievance', GrievanceSchema)
