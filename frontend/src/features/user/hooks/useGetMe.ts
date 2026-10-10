import { useQuery } from "@tanstack/react-query"
import { getMeRequest, type GetMeResponse } from "../api"
import type { ApiError } from "@/lib/api"

function useGetMe() {
  return useQuery<GetMeResponse, ApiError>({
    queryKey: ["me"],
    queryFn: getMeRequest,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 60_000,
  })
}

export { useGetMe }
