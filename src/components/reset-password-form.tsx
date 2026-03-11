import { useState } from "react"
import { AuthVisualPanel } from "@/components/auth-visual-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { resetPassword } from "@/lib/api/curanet"

interface ResetPasswordFormProps {
  token: string
  onSuccess?: () => void
  onBackToLogin?: () => void
}

export function ResetPasswordForm({
  token,
  onSuccess,
  onBackToLogin,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)

  const validatePassword = (pwd: string): string[] => {
    const issues: string[] = []
    if (pwd.length < 8) issues.push("Password must be at least 8 characters")
    if (!/[A-Z]/.test(pwd)) issues.push("Must contain an uppercase letter")
    if (!/[a-z]/.test(pwd)) issues.push("Must contain a lowercase letter")
    if (!/[0-9]/.test(pwd)) issues.push("Must contain a number")
    return issues
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    const validationErrors = [
      ...validatePassword(password),
      password !== confirmPassword ? "Passwords don't match" : null,
    ].filter(Boolean) as string[]

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      await resetPassword(token, password)
      setSuccess(true)
      setPassword("")
      setConfirmPassword("")

      if (onSuccess) {
        setTimeout(onSuccess, 2000)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to reset password"
      setErrors([message])
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="mx-auto w-full max-w-sm overflow-hidden p-0 md:max-w-4xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="rounded-lg border border-green-300/60 bg-green-50 p-4 text-center text-sm text-green-900">
              <p className="font-medium">Password reset successful</p>
              <p className="mt-2 text-xs">You can now log in with your new password.</p>
            </div>
            {onBackToLogin && (
              <Button onClick={onBackToLogin} className="mt-4 w-full">
                Back to sign in
              </Button>
            )}
          </div>
          <AuthVisualPanel />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden p-0 md:max-w-4xl">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="p-6 md:p-8">
          <FieldGroup>
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Reset your password</h1>
              <p className="text-balance text-muted-foreground">Enter your new password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <FieldDescription className="mt-1 text-xs">
                  Must be at least 8 characters with uppercase, lowercase, and a number
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>

              {errors.length > 0 && (
                <FieldError errors={errors.map((msg) => ({ message: msg }))} />
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Resetting..." : "Reset password"}
              </Button>

              {onBackToLogin && (
                <Button
                  variant="outline"
                  onClick={onBackToLogin}
                  disabled={loading}
                  className="w-full"
                >
                  Back to sign in
                </Button>
              )}
            </form>
          </FieldGroup>
        </div>
        <AuthVisualPanel />
      </CardContent>
    </Card>
  )
}
