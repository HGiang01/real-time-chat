import { AuthLayout } from "../components/AuthLayout"
import { LoginForm } from "../components/LoginForm"

function Login() {
  // TODO: call refresh token
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}

export { Login }
