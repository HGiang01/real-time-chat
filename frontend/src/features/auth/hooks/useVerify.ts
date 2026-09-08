import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import type { ApiError } from "@/lib/api.ts"
import { verifyRequest, type VerifyRequest } from "@/features/auth/api.ts"

function useVerify() {
  const navigate = useNavigate()

  return useMutation<string, ApiError, VerifyRequest>({
    mutationFn: verifyRequest,
    onSuccess: () => {
      navigate("/")
    },
  })
}
export { useVerify }
