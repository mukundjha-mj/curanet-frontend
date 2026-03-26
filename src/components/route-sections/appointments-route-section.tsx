import { Suspense, lazy } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"

// Prefetch the detail dialog chunk when a user hovers an appointment row so the
// modal is already loaded by the time they click.
const prefetchAppointmentDialog = () => {
  void import("@/components/dialogs/appointment-detail-dialog-content")
}

const getCurrentTimeMs = () => Date.now()
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardData } from "@/lib/api/types"

const AppointmentSchedulerForm = lazy(() =>
  import("@/components/forms/appointment-scheduler-form").then((module) => ({
    default: module.AppointmentSchedulerForm,
  }))
)

interface DoctorOption {
  healthId: string
  label: string
  email: string | null
}

interface AppointmentRouteSectionProps {
  activePath: string
  dashboard: DashboardData | null
  isPatient: boolean
  loading: boolean
  doctorLoading: boolean
  doctorOptions: DoctorOption[]
  doctorSearchTerm: string
  setDoctorSearchTerm: React.Dispatch<React.SetStateAction<string>>
  doctorDropdownOpen: boolean
  setDoctorDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
  filteredDoctors: DoctorOption[]
  appointmentForm: {
    doctorId: string
    requestedTime: string
    reasonForVisit: string
  }
  setAppointmentForm: React.Dispatch<
    React.SetStateAction<{
      doctorId: string
      requestedTime: string
      reasonForVisit: string
    }>
  >
  handleScheduleAppointment: (event: FormEvent<HTMLFormElement>) => Promise<void>
  submittingAppointment: boolean
  editingAppointmentId: string | null
  setEditingAppointmentId: React.Dispatch<React.SetStateAction<string | null>>
  appointmentMessage: string | null
  setAppointmentMessage: React.Dispatch<React.SetStateAction<string | null>>
  appointmentError: string | null
  setAppointmentError: React.Dispatch<React.SetStateAction<string | null>>
  canEditPendingAppointment: (requestedTime: string) => boolean
  handleEditPendingAppointment: (appointment: DashboardData["appointments"][number]) => void
  setSelectedAppointment: React.Dispatch<React.SetStateAction<DashboardData["appointments"][number] | null>>
  getTomorrowMinDateTime: () => string
}

export default function AppointmentsRouteSection({
  activePath,
  dashboard,
  isPatient,
  loading,
  doctorLoading,
  doctorOptions,
  doctorSearchTerm,
  setDoctorSearchTerm,
  doctorDropdownOpen,
  setDoctorDropdownOpen,
  filteredDoctors,
  appointmentForm,
  setAppointmentForm,
  handleScheduleAppointment,
  submittingAppointment,
  editingAppointmentId,
  setEditingAppointmentId,
  appointmentMessage,
  setAppointmentMessage,
  appointmentError,
  setAppointmentError,
  canEditPendingAppointment,
  handleEditPendingAppointment,
  setSelectedAppointment,
  getTomorrowMinDateTime,
}: AppointmentRouteSectionProps) {
  const rows =
    activePath === "/appointments/upcoming"
      ? dashboard?.appointments.filter(
          (apt) =>
            (apt.status === "PENDING" || apt.status === "CONFIRMED") &&
            new Date(apt.requestedTime).getTime() >= getCurrentTimeMs()
        ) ?? []
      : activePath === "/appointments/history"
        ? dashboard?.appointments.filter(
            (apt) =>
              apt.status === "COMPLETED" ||
              apt.status === "CANCELLED" ||
              apt.status === "REJECTED"
          ) ?? []
        : dashboard?.appointments ?? []

  const showScheduler =
    isPatient &&
    (activePath === "/appointments" ||
      activePath === "/appointments/schedule" ||
      activePath === "/appointments/book")

  const pendingRows = dashboard?.appointments.filter((apt) => apt.status === "PENDING") ?? []
  const isAppointmentsSectionLoading = loading || (showScheduler && doctorLoading && doctorOptions.length === 0)

  if (isAppointmentsSectionLoading) {
    return (
      <div className="space-y-4">
        {showScheduler ? (
          <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
            <Skeleton className="h-6 w-56" />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        ) : null}

        <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
          <Skeleton className="h-6 w-44" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showScheduler ? (
        <Suspense fallback={
          <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
            <Skeleton className="h-6 w-56" />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        }>
          <AppointmentSchedulerForm
            doctorLoading={doctorLoading}
            doctorOptions={doctorOptions}
            doctorSearchTerm={doctorSearchTerm}
            setDoctorSearchTerm={setDoctorSearchTerm}
            doctorDropdownOpen={doctorDropdownOpen}
            setDoctorDropdownOpen={setDoctorDropdownOpen}
            filteredDoctors={filteredDoctors}
            appointmentForm={appointmentForm}
            setAppointmentForm={setAppointmentForm}
            onSubmit={handleScheduleAppointment}
            submittingAppointment={submittingAppointment}
            editingAppointmentId={editingAppointmentId}
            appointmentMessage={appointmentMessage}
            appointmentError={appointmentError}
            onCancelEdit={() => {
              setEditingAppointmentId(null)
              setAppointmentForm((prev) => ({ ...prev, requestedTime: "", reasonForVisit: "" }))
              setAppointmentMessage(null)
              setAppointmentError(null)
            }}
            getTomorrowMinDateTime={getTomorrowMinDateTime}
            pendingContent={(
              <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
                <h3 className="text-lg font-semibold">Pending Appointments ({pendingRows.length})</h3>
                <div className="mt-3 space-y-2">
                  {pendingRows.slice(0, 6).map((apt) => {
                    const editable = canEditPendingAppointment(apt.requestedTime)
                    return (
                      <button
                        key={apt.id}
                        type="button"
                        onClick={() => setSelectedAppointment(apt)}
                        className="w-full rounded-lg border bg-background p-3 text-left transition-colors hover:bg-accent/50"
                        onMouseEnter={prefetchAppointmentDialog}
                      >
                        <p className="font-medium">{apt.reasonForVisit ?? "General consultation"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.requestedTime).toLocaleString()} • {apt.status}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleEditPendingAppointment(apt)
                            }}
                            disabled={!editable}
                          >
                            Edit
                          </Button>
                          {!editable ? (
                            <p className="text-xs text-muted-foreground">Edit only available for appointments tomorrow or later.</p>
                          ) : null}
                        </div>
                      </button>
                    )
                  })}
                  {pendingRows.length === 0 ? <p className="text-sm text-muted-foreground">No pending appointments.</p> : null}
                </div>
              </div>
            )}
          />
        </Suspense>
      ) : null}

      <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
        <h3 className="text-lg font-semibold">Appointments ({rows.length})</h3>
        <div className="mt-3 space-y-2">
          {rows.slice(0, 12).map((apt) => (
            <button
              key={apt.id}
              type="button"
              onClick={() => setSelectedAppointment(apt)}
              onMouseEnter={prefetchAppointmentDialog}
              className="w-full rounded-lg border bg-background p-3 text-left transition-colors hover:bg-accent/50"
            >
              <p className="font-medium">{apt.reasonForVisit ?? "General consultation"}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(apt.requestedTime).toLocaleString()} • {apt.status}
              </p>
            </button>
          ))}
          {rows.length === 0 ? <p className="text-sm text-muted-foreground">No appointments found for this section.</p> : null}
        </div>
      </div>
    </div>
  )
}