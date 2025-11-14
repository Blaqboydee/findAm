import { Suspense } from "react"
import SearchPage from "./SearchPage"

export default function DashboardPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-neutral-600">Loading dashboard...</div>}>
      <SearchPage />
    </Suspense>
  )
}
