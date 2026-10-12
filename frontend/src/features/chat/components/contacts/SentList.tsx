import { ScreenLoader } from "@/pages/ScreenLoader"
import { useGetRequests, useRestoreRequest } from "../../hooks/contact.queries"
import { ContactItem } from "./ContactItem"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconRotateClockwise2 } from "@tabler/icons-react"

function SentList() {
  const { data, error, isPending, isError } = useGetRequests("outgoing")
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  )
  const { mutate, isPending: isRestorePending } = useRestoreRequest()

  function handleRestoreDialogOpen(requestId: string) {
    setIsRestoreDialogOpen(true)
    setSelectedRequestId(requestId)
  }

  function handleRestoreRequest() {
    if (!selectedRequestId) return

    mutate(selectedRequestId, {
      onSuccess: () => {
        setIsRestoreDialogOpen(false)
        setSelectedRequestId(null)
      },
      onError: (error) => {
        console.error("Failed to restore request:", error)
      },
    })
  }

  if (isPending)
    return (
      <ScreenLoader
        title="Loading sent invitations..."
        subtitle="Just a moment."
      />
    )

  if (data && data.length === 0)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="text-lg font-semibold text-muted-foreground">
          No sent invitations
        </p>
        <p className="text-sm text-muted-foreground">
          Invitations you send will appear here.
        </p>
      </div>
    )

  if (isError)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="text-lg font-semibold text-destructive">
          Couldn't load sent invitations
        </p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    )

  return (
    <>
      <ul className="mt-2 flex-1 space-y-2 overflow-y-auto">
        {data.map((contact) => (
          <ContactItem
            key={contact.requestId}
            contact={contact}
            additionalInfo={contact.message}
            action={
              <>
                <Button
                  className="ml-2"
                  onClick={() => {
                    handleRestoreDialogOpen(contact.requestId)
                  }}
                >
                  <IconRotateClockwise2 />
                  Restore
                </Button>
              </>
            }
          />
        ))}
      </ul>

      <ConfirmDialog
        title="Restore Invitation"
        message="Are you sure you want to restore this invitation?"
        confirmButton={
          <Button
            variant="destructive"
            onClick={handleRestoreRequest}
            disabled={isRestorePending}
          >
            {isRestorePending ? "Restoring..." : "Restore"}
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
        isOpen={isRestoreDialogOpen}
        onOpenChange={setIsRestoreDialogOpen}
      />
    </>
  )
}

export { SentList }
