// Sign up
interface SignupRequest {
  username: string
  password: string
  email: string
}

// Verify account
interface VerifyRequest {
  email: string
  otp: string
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

// Change password
interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export type {
  SignupRequest,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  VerifyRequest,
}
