import { Suspense } from "react"
import DashboardPage from "./DashboardPage"

export default function DashboardPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-neutral-600">Loading dashboard...</div>}>
      <DashboardPage />
    </Suspense>
  )
}
