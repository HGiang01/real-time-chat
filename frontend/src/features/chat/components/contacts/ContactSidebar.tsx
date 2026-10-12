import { useState } from "react"
import {
  IconBan,
  IconMailDown,
  IconSend,
  IconUserPlus,
  IconUsers,
  IconUsersPlus,
} from "@tabler/icons-react"

import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { CreateGroupDialog } from "./CreateGroupDialog"
import { AddFriendDialog } from "./AddFriendDialog"
import type { ContactTab } from "@/features/chat/components/contacts/index.tsx"

interface ContactSidebarProps {
  activeTab: ContactTab
  onSelectTab: (tab: ContactTab) => void
}

function ContactSidebar({ activeTab, onSelectTab }: ContactSidebarProps) {
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false)
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false)

  const handleSelectContactsTab = () => onSelectTab("contacts")
  const handleSelectReceiverRequestsTab = () => onSelectTab("receivedRequests")
  const handleSelectSentRequestsTab = () => onSelectTab("sentRequests")
  const handleSelectBlockedTab = () => onSelectTab("blocked")
  const openAddFriendDialog = () => setIsAddFriendDialogOpen(true)
  const openCreateGroupDialog = () => setIsCreateGroupDialogOpen(true)

  return (
    <>
      <ButtonGroup orientation="vertical" className="h-full w-full space-y-1">
        <Button
          variant={activeTab == "contacts" ? "secondary" : "ghost"}
          size="lg"
          onClick={handleSelectContactsTab}
        >
          <IconUsers />
          Contacts
        </Button>

        <Button
          variant={activeTab == "receivedRequests" ? "secondary" : "ghost"}
          size="lg"
          onClick={handleSelectReceiverRequestsTab}
        >
          <IconMailDown />
          Received requests
        </Button>

        <Button
          variant={activeTab == "sentRequests" ? "secondary" : "ghost"}
          size="lg"
          onClick={handleSelectSentRequestsTab}
        >
          <IconSend />
          Sent requests
        </Button>

        <Button
          variant={activeTab == "blocked" ? "secondary" : "ghost"}
          size="lg"
          onClick={handleSelectBlockedTab}
        >
          <IconBan />
          Blocked users
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="mt-auto"
          onClick={openAddFriendDialog}
        >
          <IconUserPlus />
          Add friend
        </Button>

        <Button variant="secondary" size="lg" onClick={openCreateGroupDialog}>
          <IconUsersPlus />
          Create group
        </Button>
      </ButtonGroup>

      <AddFriendDialog
        open={isAddFriendDialogOpen}
        onOpenChange={setIsAddFriendDialogOpen}
      />
      <CreateGroupDialog
        open={isCreateGroupDialogOpen}
        onOpenChange={setIsCreateGroupDialogOpen}
      />
    </>
  )
}

export { ContactSidebar }
