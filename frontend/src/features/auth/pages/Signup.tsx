import { AuthLayout } from "@/features/auth/components/AuthLayout.tsx"
import { SignupForm } from "@/features/auth/components/SignupForm.tsx"

function Signup() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  )
}

export { Signup }
