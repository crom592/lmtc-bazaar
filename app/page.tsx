import { Suspense } from 'react'
import PageContent from './components/PageContent'

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="text-lg text-gray-600">로딩 중...</div>
    </div>}>
      <PageContent />
    </Suspense>
  )
}