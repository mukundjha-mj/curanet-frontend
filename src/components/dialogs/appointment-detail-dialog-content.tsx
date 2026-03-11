import { Button } from "@/components/ui/button"
import type { DashboardData } from "@/lib/api/types"

interface AppointmentDoctor {
  healthId?: string | null
  healthProfile?: {
    displayName?: string | null
    firstName?: string | null
    lastName?: string | null
  } | null
}

interface AppointmentDetailDialogContentProps {
  appointment: DashboardData["appointments"][number] | null
  cancellingAppointmentId: string | null
  onCancel: (appointmentId: string) => Promise<void>
  onEdit: (appointment: DashboardData["appointments"][number]) => void
  onClose: () => void
  canEditPendingAppointment: (requestedTime: string) => boolean
  formatFieldName: (key: string) => string
  formatDateTime: (date: string) => string
}

export function AppointmentDetailDialogContent({
  appointment,
  cancellingAppointmentId,
  onCancel,
  onEdit,
  onClose,
  canEditPendingAppointment,
  formatFieldName,
  formatDateTime,
}: AppointmentDetailDialogContentProps) {
  if (!appointment) {
    return null
  }

  return (
    <div className="space-y-3">
      {Object.entries(appointment)
        .filter(([key]) => key !== "id")
        .map(([key, value]) => {
          // Skip empty/null values
          if (!value) {
            return null
          }

          // Handle doctor object
          if (key === "doctor" && typeof value === "object" && value !== null) {
            const doctorObj = value as AppointmentDoctor
            const doctorName = doctorObj?.healthProfile?.displayName ||
              `${doctorObj?.healthProfile?.firstName || ""} ${doctorObj?.healthProfile?.lastName || ""}`.trim() ||
              doctorObj?.healthId ||
              "Unknown Doctor"
            const doctorId = doctorObj?.healthId || "N/A"
            return (
              <div key={key} className="rounded-md border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Doctor
                </p>
                <p className="mt-1 text-sm font-medium">{doctorName} ({doctorId})</p>
              </div>
            )
          }

          // Handle duration field
          if (key === "duration" && typeof value === "number") {
            const minutes = value
            const displayDuration = minutes >= 60
              ? `${Math.floor(minutes / 60)} Hour ${minutes % 60}m`.replace(/(\d+h) 0m/, "$1")
              : `${minutes} Min`
            return (
              <div key={key} className="rounded-md border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Duration
                </p>
                <p className="mt-1 text-sm font-medium">{displayDuration}</p>
              </div>
            )
          }

          // Skip doctor ID if we have doctor object
          if (key === "doctorId" && appointment.doctor) {
            return null
          }

          // Format date fields
          const dateFields = ["requestedTime", "createdAt", "updatedAt", "confirmedAt", "rejectedAt", "cancelledAt"]
          const isDateField = dateFields.includes(key)

          return (
            <div key={key} className="rounded-md border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {formatFieldName(key)}
              </p>
              <p className="mt-1 text-sm font-medium">
                {isDateField && typeof value === "string" ? formatDateTime(value) : String(value)}
              </p>
            </div>
          )
        })}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
        {appointment.status === "PENDING" && canEditPendingAppointment(appointment.requestedTime) ? (
          <Button
            type="button"
            onClick={() => {
              onEdit(appointment)
              onClose()
            }}
          >
            Edit Appointment
          </Button>
        ) : null}
        {appointment.status === "PENDING" ? (
          <Button
            type="button"
            variant="destructive"
            disabled={cancellingAppointmentId === appointment.id}
            onClick={() => onCancel(appointment.id)}
          >
            {cancellingAppointmentId === appointment.id ? "Cancelling..." : "Cancel Appointment"}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
