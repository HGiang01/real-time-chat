import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
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
  IconBrandGoogle,
  IconEye,
} from "@tabler/icons-react"
import { Link } from "react-router"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { type LoginFormValues, loginSchema } from "../schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "../hooks/useLogin"

function LoginForm() {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const { mutate, isPending, isError, error } = useLogin()

  function onSubmit(values: LoginFormValues) {
    mutate(values)
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  function TogglePasswordVisibility() {
    if (isPasswordVisible) {
      setIsPasswordVisible(false)
    } else {
      setIsPasswordVisible(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <FieldGroup>
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
                  autoComplete="off"
                  required
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

        {/* Remember me field */}
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox
                id={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />

              <FieldLabel htmlFor={field.name}>Remember me</FieldLabel>

              <Link
                to="/signup"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-foreground"
                )}
              >
                Sign up
              </Link>
            </Field>
          )}
        />

        <Button
          type="submit"
          className="h-12 text-[14px] font-bold"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
          <IconArrowRight data-icon="inline-end" />
        </Button>
      </FieldGroup>

      <Separator className="mt-5 mb-5" />

      <a
        href={import.meta.env.VITE_API_GOOGLE_OAUTH2_URL}
        className={buttonVariants({
          variant: "secondary",
          className: "h-12 w-full text-[14px] font-bold",
        })}
      >
        <IconBrandGoogle data-icon="inline-start" />
        Continue with Google
      </a>

      {isError && (
        <div className="mt-5 text-center text-destructive">
          {error.response?.data.detail ?? "Login failed. Please try again."}
        </div>
      )}
    </form>
  )
}

export { LoginForm }
