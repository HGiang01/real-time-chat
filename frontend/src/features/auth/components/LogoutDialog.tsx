import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/features/auth/hooks/auth.queries.ts"

interface LogoutDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function LogoutDialog({ isOpen, onOpenChange }: LogoutDialogProps) {
  const { mutate, isPending } = useLogout()

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false)
      },
      onError: (error) => {
        console.error("Logout failed:", error)
      },
    })
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Log Out"
      message="Are you sure you want to log out?"
      confirmButton={<Button variant="outline">Cancel</Button>}
      cancelButton={
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={isPending}
        >
          {isPending ? "Logging Out..." : "Log Out"}
        </Button>
      }
    />
  )
}

export { LogoutDialog }
