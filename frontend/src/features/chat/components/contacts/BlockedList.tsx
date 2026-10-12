import { ScreenLoader } from "@/pages/ScreenLoader"
import { useGetBlocked, useUnblockContact } from "../../hooks/contact.queries"
import { ContactItem } from "@/features/chat/components/contacts/ContactItem.tsx"
import { Button } from "@/components/ui/button.tsx"
import { IconLockOpen } from "@tabler/icons-react"
import { ConfirmDialog } from "@/components/ConfirmDialog.tsx"
import { useState } from "react"

function BlockedList() {
  const { data, error, isPending, isError } = useGetBlocked()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false)
  const { mutate, isPending: isUnblockPending } = useUnblockContact()

  function handleUnblockDialogOpen(userId: string) {
    setIsUnblockDialogOpen(true)
    setSelectedUserId(userId)
  }

  function handleUnblockContact() {
    if (!selectedUserId) return

    mutate(selectedUserId, {
      onSuccess: () => {
        setIsUnblockDialogOpen(false)
        setSelectedUserId(null)
      },
      onError: (error) => {
        console.error("Failed to unblock contact:", error)
      },
    })
  }

  if (isPending)
    return (
      <ScreenLoader
        title="Loading blocked users..."
        subtitle="Just a moment."
      />
    )

  if (data && data.length === 0)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="text-lg font-semibold text-muted-foreground">
          No blocked users
        </p>
        <p className="text-sm text-muted-foreground">
          People you block will appear here.
        </p>
      </div>
    )

  if (isError)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="text-lg font-semibold text-destructive">
          Couldn't load blocked users
        </p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    )

  return (
    <>
      <ul className="mt-2 flex-1 space-y-2 overflow-y-auto">
        {data.map((contact) => (
          <ContactItem
            key={contact.userId}
            contact={contact}
            action={
              <>
                <Button
                  className="ml-2"
                  onClick={() => {
                    handleUnblockDialogOpen(contact.userId)
                  }}
                >
                  <IconLockOpen />
                  Unblock
                </Button>
              </>
            }
          />
        ))}
      </ul>

      <ConfirmDialog
        title="Unblock Invitation"
        message="Are you sure you want to unblock this invitation?"
        confirmButton={
          <Button
            variant="destructive"
            onClick={handleUnblockContact}
            disabled={isUnblockPending}
          >
            {isUnblockPending ? "Unblocking..." : "Unblock"}
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
        isOpen={isUnblockDialogOpen}
        onOpenChange={setIsUnblockDialogOpen}
      />
    </>
  )
}

export { BlockedList }
