import { useEffect } from "react"
import type { GetMeResponse } from "@/features/user/api.ts"
import { useUserStore } from "@/features/user/store/userStore.ts"

function useSyncUserStore(data: GetMeResponse | undefined) {
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    setUser(data ?? null)
  }, [data, setUser])
}

export { useSyncUserStore }
