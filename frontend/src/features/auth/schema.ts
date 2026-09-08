import { z } from "zod"

// Signup
const signupSchema = z
  .object({
    username: z.string().min(2).max(50),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])\S{6,}$/, {
        message:
          "Password must be at least 6 characters and include uppercase, lowercase, a number, and a special character",
      }),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    error: "Confirm password not match",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.input<typeof signupSchema>

// Login
const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])\S{6,}$/, {
      message:
        "Password must be at least 6 characters and include uppercase, lowercase, a number, and a special character",
    }),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

// Verify
const verifySchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
})

type VerifyFormValues = z.infer<typeof verifySchema>

// Change password
const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])\S{6,}$/, {
        message:
          "Password must be at least 6 characters and include uppercase, lowercase, a number, and a special character",
      }),
    newPassword: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])\S{6,}$/, {
        message:
          "Password must be at least 6 characters and include uppercase, lowercase, a number, and a special character",
      }),
    confirmNewPassword: z.string(),
  })
  .refine(
    ({ currentPassword, newPassword }) => currentPassword !== newPassword,
    {
      error: "New password must be different from current password",
      path: ["newPassword"],
    }
  )
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      error: "Confirm password not match",
      path: ["confirmNewPassword"],
    }
  )

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export type {
  SignupFormValues,
  LoginFormValues,
  VerifyFormValues,
  ChangePasswordFormValues,
}
export { signupSchema, loginSchema, verifySchema, changePasswordSchema }
