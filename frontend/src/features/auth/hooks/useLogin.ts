import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { type LoginRequest, loginRequest, type LoginResponse } from "../api"
import type { ApiError } from "@/lib/api.ts"

function useLogin() {
  const navigate = useNavigate()

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.accessToken)
      navigate("/chat")
    },
  })
}

export { useLogin }
