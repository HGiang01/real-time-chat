import { useQuery } from "@tanstack/react-query"
import { getMeRequest, type GetMeResponse } from "../api"
import type { ApiError } from "@/lib/api"

function useGetMe() {
  return useQuery<GetMeResponse, ApiError>({
    queryKey: ["me"],
    queryFn: getMeRequest,
    retry: false,
  })
}

export { useGetMe }
