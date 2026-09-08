import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { IconMessages } from "@tabler/icons-react"

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left side: Introduction */}
      <div className="flex flex-1 flex-col justify-center border-r p-16">
        <div className="mb-16 flex gap-4 text-primary">
          <IconMessages size={30} />
          <span className="text-xl font-bold uppercase">Chat app</span>
        </div>
        <h1 className="mb-6 text-5xl leading-tight font-bold">
          Welcome to the
          <br />
          <span className="text-primary">Real time Chat App</span>
        </h1>
        <p className="mb-16 text-[16px] font-medium">
          Experience high-fidelity communication with uncompromising security.
          Connect instantly, collaborate seamlessly, and elevate your team's
          workflow within our precision-engineered environment.
        </p>
        <Separator className="mb-10" />
        <div className="flex gap-10">
          <div>
            <div className="text-lg font-bold text-primary">99.99%</div>
            <div className="font-semibold uppercase">Uptime</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">E2E</div>
            <div className="font-semibold uppercase">Encryption</div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="relative flex flex-1 items-center justify-center p-16">
        {children}

        <div className="absolute right-0 bottom-5 left-0 flex justify-center gap-10">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <div className="absolute top-15 right-10">
        <ThemeToggle />
      </div>
    </div>
  )
}

export { AuthLayout }
