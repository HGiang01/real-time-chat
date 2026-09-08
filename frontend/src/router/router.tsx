import { createBrowserRouter } from "react-router"
import { LoginPage, SignupPage, VerifyPage } from "@/features/auth"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/verify",
    element: <VerifyPage />,
  },
])
