import { api } from "@/lib/api"

// Sign up
interface SignupRequest {
  username: string
  password: string
  email: string
}

async function signupRequest(payload: SignupRequest): Promise<string> {
  const { data } = await api.post("/auth/signup", payload)
  return data
}

// Verify account
interface VerifyRequest {
  email: string
  otp: string
}

async function verifyRequest(payload: VerifyRequest): Promise<string> {
  const { data } = await api.post("/auth/verify", payload)
  return data
}

// Login
interface LoginRequest {
  email: string
  password: string
  rememberMe: boolean
}

interface LoginResponse {
  accessToken: string
}

async function loginRequest(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload)
  return data
}

// Change password
interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

async function changePasswordRequest(
  payload: ChangePasswordRequest
): Promise<string> {
  const { data } = await api.post("/auth/change-password", payload)
  return data
}

// Logout
async function logoutRequest(): Promise<string> {
  const { data } = await api.post("/logout")
  return data
}

export type { SignupRequest, LoginRequest, LoginResponse, ChangePasswordRequest, VerifyRequest }
export { signupRequest, verifyRequest, loginRequest, changePasswordRequest, logoutRequest }
