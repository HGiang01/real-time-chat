import { api } from "@/lib/api"
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  VerifyRequest,
} from "@/features/auth/types.ts"

async function signupRequest(payload: SignupRequest): Promise<string> {
  const { data } = await api.post("/auth/signup", payload)
  return data
}

async function verifyRequest(payload: VerifyRequest): Promise<string> {
  const { data } = await api.post("/auth/verify", payload)
  return data
}

async function loginRequest(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload)
  return data
}

async function changePasswordRequest(
  payload: ChangePasswordRequest
): Promise<string> {
  const { data } = await api.post("/auth/change-password", payload)
  return data
}

// Logout
async function logoutRequest(): Promise<string> {
  const { data } = await api.post("/auth/logout")
  return data
}

export {
  signupRequest,
  verifyRequest,
  loginRequest,
  changePasswordRequest,
  logoutRequest,
}
