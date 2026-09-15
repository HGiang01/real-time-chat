import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type GetMeResponse, updateProfileRequest } from "../api.ts"
import type { ApiError } from "@/lib/api.ts"

function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation<GetMeResponse, ApiError, FormData>({
    mutationFn: updateProfileRequest,
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data)
      return data
    },
  })
}

export { useUpdateProfile }
