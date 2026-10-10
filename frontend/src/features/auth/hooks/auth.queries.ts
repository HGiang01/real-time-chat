import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import {
  changePasswordRequest,
  loginRequest,
  logoutRequest,
  signupRequest,
  verifyRequest,
} from "@/features/auth/api.ts"
import type { ApiError } from "@/lib/api.ts"
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  VerifyRequest,
} from "@/features/auth/types.ts"

function useSignup() {
  const navigate = useNavigate()

  return useMutation<string, ApiError, SignupRequest>({
    mutationFn: signupRequest,
    onSuccess: () => {
      navigate("/verify")
    },
  })
}

function useVerify() {
  const navigate = useNavigate()

  return useMutation<string, ApiError, VerifyRequest>({
    mutationFn: verifyRequest,
    onSuccess: () => {
      navigate("/login")
    },
  })
}

function useLogin() {
  const navigate = useNavigate()

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.accessToken)
      navigate("/")
    },
  })
}

function useChangePassword() {
  return useMutation<string, ApiError, ChangePasswordRequest>({
    mutationFn: changePasswordRequest,
    onSuccess: () => {
      localStorage.removeItem("access_token")
      window.location.replace("/login")
    },
  })
}

function useLogout() {
  return useMutation<string, ApiError, void>({
    mutationFn: logoutRequest,
    onSuccess: () => {
      localStorage.removeItem("access_token")
      window.location.replace("/login")
    },
  })
}

export { useSignup, useVerify, useLogin, useChangePassword, useLogout }
