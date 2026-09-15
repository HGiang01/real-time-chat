import * as React from "react"
import { useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button"
import { IconCamera, IconX } from "@tabler/icons-react"

function AvatarField({
  img,
  user,
  inputRef,
  onChange,
  handleUploadImg,
  ...restField
}: {
  img: File | undefined
  user: { avatarUrl?: string } | null
  inputRef: React.RefObject<HTMLInputElement | null>
  onChange: (file: File | undefined) => void
  handleUploadImg: () => void
} & Record<string, unknown>) {
  const previewSrc: string | undefined = useMemo(() => {
    if (img instanceof File) return URL.createObjectURL(img)
    if (user && user.avatarUrl) return user.avatarUrl
    return undefined
  }, [img, user])

  useEffect(() => {
    return () => {
      if (img instanceof File && previewSrc) URL.revokeObjectURL(previewSrc)
    }
  }, [img, previewSrc])

  return (
    <>
      <div className="relative size-20!">
        <div className="h-full overflow-hidden rounded-full bg-secondary">
          {previewSrc && (
            <img
              src={previewSrc}
              alt="avatar-update"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {img ? (
          <Button
            type="button"
            variant="destructive"
            size="icon-xs"
            className="absolute top-0 right-0"
            onClick={() => onChange(undefined)}
          >
            <IconX />
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute right-0 bottom-0"
            onClick={handleUploadImg}
          >
            <IconCamera />
          </Button>
        )}
      </div>

      <Input
        {...restField}
        ref={inputRef}
        id={restField.name as string}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onChange(file)
          e.target.value = ""
        }}
      />
    </>
  )
}

export { AvatarField }
