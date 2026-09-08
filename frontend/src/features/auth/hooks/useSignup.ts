import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import type { ApiError } from "@/lib/api.ts"
import { signupRequest, type SignupRequest } from "@/features/auth/api.ts"

function useSignup() {
  const navigate = useNavigate()

  return useMutation<string, ApiError, SignupRequest>({
    mutationFn: signupRequest,
    onSuccess: () => {
      navigate("/verify")
    },
  })
}

export { useSignup }
