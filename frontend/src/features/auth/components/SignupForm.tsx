import { Button, buttonVariants } from "@/components/ui/button"
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
import {
  IconMail,
  IconLock,
  IconEyeOff,
  IconArrowRight,
  IconUser,
  IconEye,
} from "@tabler/icons-react"
import { Link } from "react-router"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { type SignupFormValues, signupSchema } from "@/features/auth/schema.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignup } from "@/features/auth/hooks/useSignup.ts"

function SignupForm() {
  const { control, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const { mutate, isPending, isError, error } = useSignup()

  function onSubmit(values: SignupFormValues) {
    const { username, email, password } = values
    mutate({ username, email, password })
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)

  function TogglePasswordVisibility() {
    if (isPasswordVisible) {
      setIsPasswordVisible(false)
    } else {
      setIsPasswordVisible(true)
    }
  }

  function ToggleConfirmPasswordVisibility() {
    if (isConfirmPasswordVisible) {
      setIsConfirmPasswordVisible(false)
    } else {
      setIsConfirmPasswordVisible(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <FieldGroup>
        {/* Username field */}
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Username</FieldLabel>

              <InputGroup className="h-12 p-3">
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type="text"
                  placeholder="Nikki"
                  name="username"
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

        {/* Email field */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Email address</FieldLabel>

              <InputGroup className="h-12 p-3">
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="your@email.com"
                  name="email"
                  required
                  autoComplete="off"
                />

                <InputGroupAddon>
                  <IconMail />
                </InputGroupAddon>
              </InputGroup>

              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Password field */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>

              <InputGroup className="h-12 p-3">
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="●●●●●●●●"
                  name="password"
                  required
                />

                <InputGroupAddon>
                  <IconLock />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                  <Button variant="ghost" onClick={TogglePasswordVisibility}>
                    {isPasswordVisible ? <IconEye /> : <IconEyeOff />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>

              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Confirm Password field */}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>

              <InputGroup className="h-12 p-3">
                <InputGroupInput
                  {...field}
                  id={field.name}
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="●●●●●●●●"
                  name="confirmPassword"
                  required
                />

                <InputGroupAddon>
                  <IconLock />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                  <Button
                    variant="ghost"
                    onClick={ToggleConfirmPasswordVisibility}
                  >
                    {isConfirmPasswordVisible ? <IconEye /> : <IconEyeOff />}
                  </Button>
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
            {isPending ? "Signing up..." : "Sign up"}
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

export { SignupForm }
