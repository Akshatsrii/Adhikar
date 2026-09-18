import mongoose from 'mongoose'

export interface IAuditLog {
  adminId: mongoose.Types.ObjectId
  action: string
  target: string
  details?: string
  ip?: string
  createdAt: Date
}

const auditLogSchema = new mongoose.Schema<IAuditLog>({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  details: { type: String },
  ip: { type: String },
  createdAt: { type: Date, default: Date.now },
})

// Index for faster queries when filtering by admin or action
auditLogSchema.index({ adminId: 1, createdAt: -1 })
auditLogSchema.index({ action: 1, createdAt: -1 })

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', auditLogSchema)
