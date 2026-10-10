import type { ReactNode } from "react"
import { useGetMe } from "@/features/user/hooks/useGetMe.ts"
import { Navigate } from "react-router"
import { ScreenLoader } from "@/pages/ScreenLoader.tsx"
import { useSyncUserStore } from "@/features/user/hooks/useSyncUserStore.ts"

function RedirectIfAuth({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useGetMe()
  useSyncUserStore(user)

  if (isLoading)
    return (
      <ScreenLoader
        title="Logging in"
        subtitle=" Please wait while we process your request. Do not refresh the page."
      />
    )
  if (user) return <Navigate to="/" replace />

  return children
}

export { RedirectIfAuth }
