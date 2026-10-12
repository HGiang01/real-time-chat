import { useState } from "react"
import {
  useAcceptRequest,
  useGetRequests,
  useRejectRequest,
} from "../../hooks/contact.queries"
import { ScreenLoader } from "@/pages/ScreenLoader"
import { Button } from "@/components/ui/button.tsx"
import { ContactItem } from "@/features/chat/components/contacts/ContactItem.tsx"
import { IconCheck, IconX } from "@tabler/icons-react"
import { ConfirmDialog } from "@/components/ConfirmDialog.tsx"

function ReceivedList() {
  const { data, error, isPending, isError } = useGetRequests("incoming")
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  )
  const { mutate: acceptMutate, isPending: isAcceptPending } =
    useAcceptRequest()
  const { mutate: rejectMutate, isPending: isRejectPending } =
    useRejectRequest()

  function handleAcceptDialogOpen(requestId: string) {
    setIsAcceptDialogOpen(true)
    setSelectedRequestId(requestId)
  }

  function handleRejectDialogOpen(requestId: string) {
    setIsRejectDialogOpen(true)
    setSelectedRequestId(requestId)
  }

  function handleAcceptRequest() {
    if (!selectedRequestId) return

    acceptMutate(selectedRequestId, {
      onSuccess: () => {
        setIsAcceptDialogOpen(false)
        setSelectedRequestId(null)
      },
      onError: (error) => {
        console.error("Failed to accept request:", error)
      },
    })
  }

  function handleRejectRequest() {
    if (!selectedRequestId) return
    rejectMutate(selectedRequestId, {
      onSuccess: () => {
        setIsRejectDialogOpen(false)
        setSelectedRequestId(null)
      },
      onError: (error) => {
        console.error("Failed to reject request:", error)
      },
    })
  }

  if (isPending)
    return (
      <ScreenLoader
        title="Loading received invitations..."
        subtitle="Just a moment."
      />
    )

  if (data && data.length === 0)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="text-lg font-semibold text-muted-foreground">
          No received invitations
        </p>
        <p className="text-sm text-muted-foreground">
          Invitations from other people will appear here.
        </p>
      </div>
    )

  if (isError)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="text-lg font-semibold text-destructive">
          Couldn't load received invitations
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
                  variant="destructive"
                  onClick={() => handleRejectDialogOpen(contact.requestId)}
                >
                  <IconX />
                  Reject
                </Button>
                <Button
                  className="ml-2"
                  onClick={() => handleAcceptDialogOpen(contact.requestId)}
                >
                  <IconCheck />
                  Accept
                </Button>
              </>
            }
          />
        ))}
      </ul>

      <ConfirmDialog
        title="Accept Invitation"
        message="Are you sure you want to accept this invitation?"
        confirmButton={
          <Button onClick={handleAcceptRequest} disabled={isAcceptPending}>
            {isAcceptPending ? "Accepting..." : "Accept"}
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
        isOpen={isAcceptDialogOpen}
        onOpenChange={setIsAcceptDialogOpen}
      />

      <ConfirmDialog
        title="Reject Invitation"
        message="Are you sure you want to reject this invitation?"
        confirmButton={
          <Button
            variant="destructive"
            onClick={handleRejectRequest}
            disabled={isRejectPending}
          >
            {isRejectPending ? "Rejecting..." : "Reject"}
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      />
    </>
  )
}

export { ReceivedList }
