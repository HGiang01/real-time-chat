import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { router } from "@/router/router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "./components/ui/tooltip"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  // </StrictMode>
)
