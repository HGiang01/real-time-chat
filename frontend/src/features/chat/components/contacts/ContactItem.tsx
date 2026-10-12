import { type ReactNode } from "react"
import { cn, extractAvatarFallback } from "@/lib/utils"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx"
import type {
  GetContactResponse,
  GetRequestResponse,
  UserStatus,
} from "../../types"

interface ContactItemProps {
  contact: GetContactResponse | GetRequestResponse
  additionalInfo?: string
  status?: UserStatus
  action?: ReactNode
  className?: string
}

function ContactItem({
  contact,
  additionalInfo,
  status,
  action,
  className,
}: ContactItemProps) {
  return (
    <li
      className={cn(
        "flex h-fit w-full cursor-pointer items-center justify-center rounded-(--radius) border border-border bg-card px-2 py-4",
        className
      )}
    >
      <Avatar size="lg">
        <AvatarImage src={contact.avatarUrl} alt={contact.username} />
        <AvatarFallback>
          {extractAvatarFallback(contact.username)}
        </AvatarFallback>

        {status == "online" && (
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        )}
        {status == "offline" && (
          <AvatarBadge className="bg-gray-600 dark:bg-gray-800" />
        )}
        {status == "busy" && (
          <AvatarBadge className="bg-yellow-600 dark:bg-red-800" />
        )}
      </Avatar>

      <div className="flex-1 overflow-hidden px-4 select-none">
        <p className="font-medium">{contact.username}</p>
        <span className="block text-sm text-muted-foreground">
          {additionalInfo}
        </span>
      </div>

      {action}
    </li>
  )
}

export { ContactItem }
