import { createBrowserRouter } from "react-router"
import { LoginPage, SignupPage, VerifyPage } from "@/features/auth"
import { ChatPage } from "@/features/chat"
import { RedirectIfAuth } from "@/router/RedirectIfAuth.tsx"
import { StompProvider } from "@/features/chat/stomp-provider.tsx"
import { RequireAuth } from "@/router/RequireAuth.tsx"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <RedirectIfAuth>
        <LoginPage />
      </RedirectIfAuth>
    ),
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/verify",
    element: <VerifyPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <StompProvider>
          <ChatPage />
        </StompProvider>
      </RequireAuth>
    ),
  },
])
