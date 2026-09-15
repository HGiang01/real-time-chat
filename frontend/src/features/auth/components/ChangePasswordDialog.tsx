import { Controller, useForm } from "react-hook-form"
import { type ChangePasswordFormValues, changePasswordSchema } from "../schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useChangePassword } from "../hooks/useChangePassword"
import { useState } from "react"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const { control, handleSubmit } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  const { mutate, isPending, isError, error } = useChangePassword()

  function onSubmit(values: ChangePasswordFormValues) {
    const { currentPassword, newPassword } = values
    mutate({ currentPassword, newPassword })
  }

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false)
  function ToggleCurrentPasswordVisibility() {
    if (isCurrentPasswordVisible) {
      setIsCurrentPasswordVisible(false)
    } else {
      setIsCurrentPasswordVisible(true)
    }
  }

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)
  function ToggleNewPasswordVisibility() {
    if (isNewPasswordVisible) {
      setIsNewPasswordVisible(false)
    } else {
      setIsNewPasswordVisible(true)
    }
  }

  const [isNewConfirmPasswordVisible, setIsNewConfirmPasswordVisible] =
    useState(false)
  function ToggleNewConfirmPasswordVisibility() {
    if (isNewConfirmPasswordVisible) {
      setIsNewConfirmPasswordVisible(false)
    } else {
      setIsNewConfirmPasswordVisible(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-[384px]!">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <FieldGroup className="mt-4 py-4">
            <Controller
              name="currentPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Current password</FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type={isCurrentPasswordVisible ? "text" : "password"}
                      placeholder="●●●●●●●●"
                      required
                    />

                    <InputGroupAddon>
                      <IconLock />
                    </InputGroupAddon>

                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        onClick={ToggleCurrentPasswordVisibility}
                      >
                        {isCurrentPasswordVisible ? (
                          <IconEye />
                        ) : (
                          <IconEyeOff />
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="newPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>New password</FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type={isNewPasswordVisible ? "text" : "password"}
                      placeholder="●●●●●●●●"
                      required
                    />

                    <InputGroupAddon>
                      <IconLock />
                    </InputGroupAddon>

                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        onClick={ToggleNewPasswordVisibility}
                      >
                        {isNewPasswordVisible ? <IconEye /> : <IconEyeOff />}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmNewPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Confirm new password
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type={isNewConfirmPasswordVisible ? "text" : "password"}
                      placeholder="●●●●●●●●"
                      required
                    />

                    <InputGroupAddon>
                      <IconLock />
                    </InputGroupAddon>

                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        onClick={ToggleNewConfirmPasswordVisibility}
                      >
                        {isNewConfirmPasswordVisible ? (
                          <IconEye />
                        ) : (
                          <IconEyeOff />
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Changing password..." : "Change Password"}
            </Button>
          </DialogFooter>

          {isError && (
            <div className="mt-5 text-center text-destructive">
              {error.response?.data.detail ?? "Login failed. Please try again."}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { ChangePasswordDialog }
