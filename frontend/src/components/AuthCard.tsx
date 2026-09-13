import React from 'react'

export function AuthCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-navy)]">{title}</h2>
      {children}
    </div>
  )
}
