'use client'

import { TLDrawBoard } from '@/components/TLDrawBoard'

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">draw.eai.ai</h1>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-4">
          <TLDrawBoard
            onSave={(data) => {
              console.log('Board saved:', data)
            }}
          />
        </div>
      </div>
    </main>
  )
}
