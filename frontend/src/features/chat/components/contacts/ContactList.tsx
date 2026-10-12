import {
  useBlockContact,
  useGetContacts,
  useRemoveContact,
} from "@/features/chat/hooks/contact.queries.ts"
import { ContactItem } from "@/features/chat/components/contacts/ContactItem.tsx"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx"
import {
  IconEraser,
  IconRefresh,
  IconSearch,
  IconSend2,
  IconUser,
  IconLock,
  IconUsersGroup,
} from "@tabler/icons-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx"
import { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { ScreenLoader } from "@/pages/ScreenLoader"
import { ConfirmDialog } from "@/components/ConfirmDialog.tsx"

function ContactList() {
  const { data, error, isPending, isError } = useGetContacts()
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchInput, setSearchInput] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const { mutate: removeMutation, isPending: isRemovePending } =
    useRemoveContact()
  const { mutate: blockMutation, isPending: isBlockPending } = useBlockContact()

  function handleRemoveDialogOpen(userId: string) {
    setIsRemoveDialogOpen(true)
    setSelectedUserId(userId)
  }

  function handleBlockDialogOpen(userId: string) {
    setIsBlockDialogOpen(true)
    setSelectedUserId(userId)
  }

  function handleRemoveContact() {
    if (!selectedUserId) return

    removeMutation(selectedUserId, {
      onSuccess: () => {
        setIsRemoveDialogOpen(false)
        setSelectedUserId(null)
      },
      onError: (error) => {
        console.error("Failed to remove contact:", error)
      },
    })
  }

  function handleBlockContact() {
    if (!selectedUserId) return

    blockMutation(selectedUserId, {
      onSuccess: () => {
        setIsBlockDialogOpen(false)
        setSelectedUserId(null)
      },
      onError: (error) => {
        console.error("Failed to block contact:", error)
      },
    })
  }

  const filteredContacts = useMemo(() => {
    if (!data || data.length === 0) return []
    const keyword = searchInput.trim().toLowerCase()
    if (!keyword) return data

    return data.filter((contact) =>
      contact.username.toLowerCase().includes(keyword)
    )
  }, [data, searchInput])

  if (isPending)
    return (
      <ScreenLoader title="Loading contacts..." subtitle="Just a moment." />
    )

  if (isError)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="text-lg font-semibold text-destructive">
          Couldn't load contacts
        </p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    )

  function handleSearchInputChange() {
    if (inputRef.current?.value) setSearchInput(inputRef.current.value)
  }

  function handleSearchInputReset() {
    if (inputRef.current) inputRef.current.value = ""
    setSearchInput("")
  }

  return (
    <>
      <div className="flex">
        <ToggleGroup variant="outline" multiple>
          <ToggleGroupItem value="bold" aria-label="Show friends">
            <IconUser />
            Friends
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Show groups">
            <IconUsersGroup />
            Groups
          </ToggleGroupItem>
        </ToggleGroup>

        <InputGroup className="ml-auto max-w-xs">
          <InputGroupInput
            placeholder="Search contacts..."
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchInputChange()
            }}
          />
          <InputGroupAddon>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Search"
              onClick={handleSearchInputChange}
            >
              <IconSearch />
            </Button>
          </InputGroupAddon>

          <InputGroupAddon align="inline-end">{`${filteredContacts.length} ${filteredContacts.length === 1 ? "result" : "results"}`}</InputGroupAddon>

          {searchInput && (
            <InputGroupAddon align="inline-end">
              <Button
                size="icon-sm"
                aria-label="Clear search"
                onClick={handleSearchInputReset}
              >
                <IconRefresh />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      <ul className="mt-2 flex-1 space-y-2 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <ContactItem
            key={contact.userId}
            contact={contact}
            action={
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveDialogOpen(contact.userId)}
                >
                  <IconEraser />
                  Remove
                </Button>
                <Button
                  variant="destructive"
                  className="ml-2"
                  onClick={() => handleBlockDialogOpen(contact.userId)}
                >
                  <IconLock />
                  Block
                </Button>
                <Button className="ml-2">
                  <IconSend2 />
                  Chat
                </Button>
              </>
            }
          />
        ))}

        {data.length === 0 && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              No contacts yet
            </p>
            <p className="text-sm text-muted-foreground">
              Add contacts to start chatting.
            </p>
          </div>
        )}
      </ul>

      <ConfirmDialog
        title="Remove Contact"
        message="Are you sure you want to remove this person from your contacts? Existing conversations will be kept, but you'll need to send a new friend request to connect again."
        confirmButton={
          <Button
            variant="destructive"
            onClick={handleRemoveContact}
            disabled={isRemovePending}
          >
            {isRemovePending ? "Removing..." : "Remove"}
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
        isOpen={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
      />

      <ConfirmDialog
        title="Block Contact"
        message="Are you sure you want to block this person? They won't be able to send you messages. You can unblock them anytime in the Blocked users tab."
        confirmButton={
          <Button
            variant="destructive"
            onClick={handleBlockContact}
            disabled={isBlockPending}
          >
            {isBlockPending ? "Blocking..." : "Block"}
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
        isOpen={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
      />
    </>
  )
}

export { ContactList }
