import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import type { ApiError } from "@/lib/api.ts"
import { changePasswordRequest, type ChangePasswordRequest } from "../api"

function useChangePassword() {
  const navigate = useNavigate()

  return useMutation<string, ApiError, ChangePasswordRequest>({
    mutationFn: changePasswordRequest,
    onSuccess: () => {
      navigate("/")
    },
  })
}
export { useChangePassword }
