import { AuthLayout } from "@/features/auth/components/AuthLayout.tsx"
import { VerifyForm } from "@/features/auth/components/VerifyForm"

function Verify() {
  return (
    <AuthLayout>
      <VerifyForm />
    </AuthLayout>
  )
}

export { Verify }
