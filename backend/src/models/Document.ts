import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose'

const documentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    originalFilename: { type: String, required: true },
    documentType: { type: String, required: true },
    fullName: { type: String },
    issueDate: { type: String },
    incomeAmount: { type: Number },
    idNumber: { type: String },
    issuingAuthority: { type: String },
    isExpired: { type: Boolean, default: null },
    ocrTextPreview: { type: String },
  },
  { timestamps: true },
)

export type DocumentRecord = InferSchemaType<typeof documentSchema>
export type DocumentRecordDocument = HydratedDocument<DocumentRecord>

export const DocumentModel = model('Document', documentSchema)
