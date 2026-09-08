import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx"
import { Controller, useForm } from "react-hook-form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx"
import { IconArrowRight, IconUser } from "@tabler/icons-react"
import { Button, buttonVariants } from "@/components/ui/button.tsx"
import { Link } from "react-router"
import { cn } from "@/lib/utils.ts"
import { verifySchema, type VerifyFormValues } from "../schema"
import { useVerify } from "../hooks/useVerify"
import { zodResolver } from "@hookform/resolvers/zod"

function VerifyForm() {
  const { control, handleSubmit } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  })

  const { mutate, isPending, isError, error } = useVerify()

  function onSubmit(values: VerifyFormValues) {
    mutate(values)
  }

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>

              <InputGroup className="h-12 p-3">
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type="text"
                  placeholder="you@example.com"
                  name="email"
                  required
                  autoComplete="off"
                />

                <InputGroupAddon>
                  <IconUser />
                </InputGroupAddon>
              </InputGroup>

              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>OTP</FieldLabel>

              <InputGroup className="h-12 p-3">
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type="text"
                  placeholder="123456"
                  name="otp"
                  required
                  autoComplete="off"
                />

                <InputGroupAddon>
                  <IconUser />
                </InputGroupAddon>
              </InputGroup>

              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Field orientation="horizontal" className="w-full justify-between">
          <p>Have an account?</p>
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-foreground"
            )}
          >
            Sign in
          </Link>
        </Field>

        <Field>
          <Button
            type="submit"
            className="h-12 text-[14px] font-bold"
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Verify"}
            <IconArrowRight data-icon="inline-end" />
          </Button>
        </Field>
      </FieldGroup>

      {isError && (
        <div className="mt-5 text-center text-destructive">
          {error.response?.data.detail ?? "Login failed. Please try again."}
        </div>
      )}
    </form>
  )
}

export { VerifyForm }
