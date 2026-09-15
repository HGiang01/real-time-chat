import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { IconPencilMinus } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { useRef, useState } from "react"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useUserStore } from "../store/userStore"
import { Controller, useForm } from "react-hook-form"
import {
  type UpdateProfileFormValues,
  updateProfileSchema,
} from "@/features/user/schema.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProfile } from "@/features/user/hooks/useUpdateProfile.ts"
import { AvatarField } from "./AvatarField"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function extractAvatarFallback(username: string | undefined): string {
  if (!username) return "undefined"

  username = username.trim()
  let result: string = ""

  for (let i = 0; i < username.length; i++) {
    if (i == 0 || username.charAt(i - 1) == " ") {
      result = result + username[i]
    }
  }

  return result.toUpperCase()
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const user = useUserStore((s) => s.user)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  const { control, handleSubmit, reset } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
  })
  const { mutate, isPending, isError, error } = useUpdateProfile()

  function onSubmit(values: UpdateProfileFormValues) {
    const formData = new FormData()
    if (values.username) formData.append("username", values.username)
    if (values.bio) formData.append("bio", values.bio)
    if (values.avatar) formData.append("avatar", values.avatar)

    mutate(formData)
    setIsEditing(false)
    reset()
  }

  const handleClickEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    reset()
  }

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      setTimeout(() => {
        setIsEditing(false)
        reset()
      }, 300)
    }
  }

  const handleUploadImg = () => {
    inputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="transition-all duration-300 ease-in-out sm:max-w-sm">
        {!isEditing ? (
          <>
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
            </DialogHeader>
            <Avatar className="size-20">
              <AvatarImage
                src={user ? user.avatarUrl : undefined}
                alt="avatar"
              />
              <AvatarFallback>
                {extractAvatarFallback(user?.username)}
              </AvatarFallback>
            </Avatar>
            <div className="text-lg font-bold">{user?.username}</div>
            <p className="text-muted-foreground">{user?.bio || "No bio yet"}</p>
            <DialogFooter>
              <Button onClick={handleClickEdit}>
                <IconPencilMinus />
                Edit Profile
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="animate-in duration-300 zoom-in-95 fade-in"
          >
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
            </DialogHeader>

            <FieldGroup className="py-4">
              <Controller
                name="avatar"
                control={control}
                render={({
                  field: { value, onChange, ...restField },
                  fieldState,
                }) => (
                  <Field>
                    <AvatarField
                      img={value}
                      user={user}
                      inputRef={inputRef}
                      onChange={onChange}
                      handleUploadImg={handleUploadImg}
                      {...restField}
                    />

                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="username"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="Username"
                      autoComplete="off"
                    />

                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="bio"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="Bio"
                      autoComplete="off"
                    />

                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>

            {isError && (
              <div className="mt-5 text-center text-destructive">
                {error.response?.data.detail ??
                  "Update profile failed. Please try again."}
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
