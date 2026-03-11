import { useState } from "react"
import { PencilIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardData } from "@/lib/api/types"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dashboard: DashboardData | null
  onSave?: (updates: Record<string, unknown>) => Promise<void>
}

export function ProfileModal({ open, onOpenChange, dashboard, onSave }: ProfileModalProps) {
  const profile = dashboard?.profile?.profile
  const user = dashboard?.profile?.user

  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const formatProfileValue = (value: unknown): string | null => {
    if (value == null) {
      return null
    }

    if (typeof value === "string") {
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : null
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return null
      }
      return value.map((item) => String(item)).join(", ")
    }

    if (typeof value === "object") {
      const parts = Object.values(value as Record<string, unknown>)
        .filter((item) => item != null && String(item).trim().length > 0)
        .map((item) => String(item))
      return parts.length > 0 ? parts.join(", ") : null
    }

    return String(value)
  }

  const handleEdit = (fieldKey: string, currentValue: unknown) => {
    setEditingField(fieldKey)
    setEditValues({
      ...editValues,
      [fieldKey]: String(currentValue ?? ""),
    })
  }

  const handleSave = async () => {
    if (!onSave) return
    setSaving(true)
    try {
      await onSave(editValues)
      setEditingField(null)
      setEditValues({})
    } catch {
      // Parent handles save failures and user feedback.
    } finally {
      setSaving(false)
    }
  }

  const handleContentPointerDown = (event: { target: EventTarget | null }) => {
    if (!editingField) return

    const target = event.target as HTMLElement
    const clickedField = target.closest("[data-field-key]")
    const keepEdit = target.closest("[data-keep-edit='true']")

    if (keepEdit) return

    const clickedKey = clickedField?.getAttribute("data-field-key")
    if (clickedKey !== editingField) {
      setEditingField(null)
    }
  }

  // Combined fields array for grid layout
  const allFields: Array<{ label: string; key: string; value: unknown }> = [
    // User Details
    { label: "Health ID", key: "healthId", value: user?.healthId },
    { label: "Email", key: "email", value: user?.email },
    { label: "Phone", key: "phone", value: user?.phone },
    { label: "Role", key: "role", value: user?.role },
    { label: "Status", key: "status", value: user?.status },
    { label: "Verified", key: "isVerified", value: user?.isVerified ? "Yes" : "No" },
    // Health Profile Details
    { label: "First Name", key: "firstName", value: profile?.firstName },
    { label: "Last Name", key: "lastName", value: profile?.lastName },
    { label: "Display Name", key: "displayName", value: profile?.displayName },
    { label: "Date of Birth", key: "dateOfBirth", value: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : null },
    { label: "Gender", key: "gender", value: profile?.gender },
    { label: "Blood Group", key: "bloodGroup", value: profile?.bloodGroup },
    { label: "Emergency Contact", key: "emergencyContact", value: profile?.emergencyContact },
    { label: "Emergency Phone", key: "emergencyPhone", value: profile?.emergencyPhone },
    { label: "Allergies", key: "allergies", value: formatProfileValue(profile?.allergies) },
    { label: "Medications", key: "medications", value: formatProfileValue(profile?.medications) },
    { label: "Address", key: "address", value: formatProfileValue(profile?.address) },
  ]

  const renderField = (field: typeof allFields[0]) => {
    const { label, key, value } = field
    const displayValue = value == null || (typeof value === "string" && value.trim() === "")
    const isEmpty = displayValue

    return (
      <div
        key={key}
        data-field-key={key}
        className={`min-w-0 rounded-md border p-4 transition-colors ${isEmpty ? "bg-muted/30 opacity-70 hover:opacity-100" : ""}`}
      >
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        {editingField === key ? (
          <Input
            value={editValues[key] ?? ""}
            onChange={(e) => setEditValues({ ...editValues, [key]: e.target.value })}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="mt-1"
            autoFocus
          />
        ) : (
          <div className="mt-2 flex min-w-0 items-center justify-between gap-2">
            <p className={`min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-sm font-medium whitespace-normal ${isEmpty ? "italic text-muted-foreground" : ""}`}>
              {isEmpty ? "Fill this" : String(value)}
            </p>
            {isEmpty && editingField !== key ? (
              <button
                onClick={() => handleEdit(key, value)}
                className="shrink-0 rounded-md p-1 hover:bg-background transition-colors"
                title={`Edit ${label}`}
              >
                <PencilIcon className="h-4 cursor-pointer w-4 text-muted-foreground hover:text-foreground" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setEditingField(null)
          setEditValues({})
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent
        className="w-[96vw] sm:!max-w-[96vw] lg:!max-w-[1000px] max-h-[92vh] overflow-y-auto"
        onPointerDownCapture={handleContentPointerDown}
        showCloseButton={false}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute cursor-pointer top-4 right-4 z-10 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:text-red-500"
          data-keep-edit="true"
        >
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex min-w-0 items-center justify-between gap-2 pb-4">
          <DialogTitle>Profile</DialogTitle>
          <div className="flex items-center gap-2">
            {editingField && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                data-keep-edit="true"
              >
                {saving ? "Saving..." : "Update"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {!dashboard?.profile?.user || !dashboard?.profile?.profile ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-max">
              {Array.from({ length: 17 }).map((_, idx) => (
                <div key={idx} className="rounded-md border p-4 space-y-2">
                  <Skeleton className="h-3 w-16 rounded" />
                  <div className="mt-2 space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-max">
              {allFields.map((field) => renderField(field))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
