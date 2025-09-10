import { Suspense } from 'react'
import PageContent from './components/PageContent'

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg text-gray-600">로딩 중...</div>
    </div>}>
      <PageContent />
    </Suspense>
  )
}