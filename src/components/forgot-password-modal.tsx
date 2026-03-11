import { useState } from "react"
import { AuthVisualPanel } from "@/components/auth-visual-panel"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { requestPasswordReset } from "@/lib/api/curanet"

interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResetRequested?: (email: string) => void
}

export function ForgotPasswordModal({
  open,
  onOpenChange,
  onResetRequested,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    try {
      if (!email.trim()) {
        setErrors(["Email is required"])
        setLoading(false)
        return
      }

      await requestPasswordReset(email.trim())
      setSuccess(true)
      setEmail("")

      if (onResetRequested) {
        onResetRequested(email)
      }

      // Close after 2 seconds
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
      }, 2000)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to request password reset"
      setErrors([message])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-4xl">
        <div className="grid md:grid-cols-2">
          <div className="p-6 md:p-8">
            <DialogHeader>
              <DialogTitle>Reset your password</DialogTitle>
              <DialogDescription>
                Enter your email address and we&apos;ll send you a link to reset your password.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              {success ? (
                <div className="rounded-lg border border-green-300/60 bg-green-50 p-4 text-sm text-green-900">
                  <p className="font-medium">Check your email</p>
                  <p className="mt-1 text-xs">We&apos;ve sent a reset link to {email}.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </Field>

                    {errors.length > 0 && (
                      <FieldError errors={errors.map((msg) => ({ message: msg }))} />
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? "Sending..." : "Send reset link"}
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              )}
            </div>
          </div>
          <AuthVisualPanel />
        </div>
      </DialogContent>
    </Dialog>
  )
}
