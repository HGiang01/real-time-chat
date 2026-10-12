import { type KeyboardEvent, type ReactNode, useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import { z } from "zod"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ContactItem } from "@/features/chat/components/contacts/ContactItem"
import {
  useAddFriend,
  useFindUser,
} from "@/features/chat/hooks/contact.queries"
import { ScreenLoader } from "@/pages/ScreenLoader"

const MAX_REQUEST_MESSAGE_LENGTH = 255
const emailSchema = z.email("Invalid email format")

interface AddFriendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function StatusMessage({ children }: { children: ReactNode }) {
  return <p className="p-4 text-center text-sm text-destructive">{children}</p>
}

function AddFriendDialog({ open, onOpenChange }: AddFriendDialogProps) {
  const [emailInput, setEmailInput] = useState("")
  const [searchedEmail, setSearchedEmail] = useState("")
  const [requestMessage, setRequestMessage] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)

  const {
    data: foundUser,
    error: findUserError,
    isFetching: isFindingUser,
    isFetched: hasSearched,
  } = useFindUser(searchedEmail)

  const {
    mutate: sendFriendRequest,
    reset: resetSendRequest,
    error: sendRequestError,
    isError: isSendRequestError,
    isPending: isSendingRequest,
  } = useAddFriend()

  const isUserNotFound =
    hasSearched && !isFindingUser && !foundUser && !findUserError
  const apiErrorMessage =
    findUserError?.response?.data.detail ??
    sendRequestError?.response?.data.detail
  const errorMessage = emailError ?? apiErrorMessage

  function resetForm() {
    setEmailInput("")
    setSearchedEmail("")
    setRequestMessage("")
    setEmailError(null)
    resetSendRequest()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  function handleSearchUser() {
    const result = emailSchema.safeParse(emailInput.trim())

    if (!result.success) {
      setEmailError(result.error.issues[0].message)
      return
    }

    setEmailError(null)
    setRequestMessage("")
    resetSendRequest()
    setSearchedEmail(result.data)
  }

  function handleEmailKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearchUser()
  }

  function handleSendRequest() {
    if (!foundUser) return

    sendFriendRequest(
      {
        receiverId: foundUser.userId,
        type: "direct",
        message: requestMessage.trim() || undefined,
      },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Enter your friend's email to add them to your contacts.
          </DialogDescription>
        </DialogHeader>

        <InputGroup>
          <InputGroupInput
            placeholder="abc@email.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleEmailKeyDown}
          />
          <InputGroupAddon align="inline-end">
            <Button
              size="icon-lg"
              variant="ghost"
              disabled={isFindingUser}
              onClick={handleSearchUser}
            >
              <IconSearch />
            </Button>
          </InputGroupAddon>
        </InputGroup>

        <Separator />

        {isFindingUser && <ScreenLoader title="Finding user..." />}

        {!isFindingUser && foundUser && (
          <div className="space-y-2">
            <ContactItem contact={foundUser} className="cursor-default" />

            <p className="text-sm">Add a message (optional)</p>
            <Textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              maxLength={MAX_REQUEST_MESSAGE_LENGTH}
              placeholder="Hi, I'd like to add you as a friend!"
              className="field-sizing-fixed h-30 w-full resize-none"
            />
            <p className="text-right text-xs text-muted-foreground">
              {requestMessage.length}/{MAX_REQUEST_MESSAGE_LENGTH}
            </p>
          </div>
        )}

        {isUserNotFound && (
          <StatusMessage>No user found with that email</StatusMessage>
        )}

        {errorMessage && <StatusMessage>{errorMessage}</StatusMessage>}

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            disabled={!foundUser || isSendingRequest || isSendRequestError}
            onClick={handleSendRequest}
          >
            {isSendingRequest ? "Sending..." : "Send request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { AddFriendDialog }
