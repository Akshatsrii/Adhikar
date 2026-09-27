import mongoose, { Schema, Document } from 'mongoose'

export interface IScheme extends Document {
  slug: string
  name: string
  department: string
  category: string
  level: 'central' | 'state'
  state: string | null
  benefit: string
  description: string
  source_url: string
  application_url: string
  deadline: string
  eligibility_rules: any[]
  documents_required: any[]
}

const SchemeSchema = new Schema<IScheme>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    category: { type: String, required: true, index: true },
    level: { type: String, required: true },
    state: { type: String, default: null, index: true },
    benefit: { type: String, required: true },
    description: { type: String, required: true },
    source_url: { type: String },
    application_url: { type: String },
    deadline: { type: String },
    eligibility_rules: { type: [Schema.Types.Mixed], default: [] },
    documents_required: { type: [Schema.Types.Mixed], default: [] }
  },
  { timestamps: true }
)

export const SchemeModel = mongoose.model<IScheme>('Scheme', SchemeSchema)
