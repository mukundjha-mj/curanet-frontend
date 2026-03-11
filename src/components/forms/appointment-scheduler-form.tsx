import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DoctorOption {
  healthId: string
  label: string
  email: string | null
}

interface AppointmentSchedulerFormProps {
  doctorLoading: boolean
  doctorOptions: DoctorOption[]
  doctorSearchTerm: string
  setDoctorSearchTerm: (term: string) => void
  doctorDropdownOpen: boolean
  setDoctorDropdownOpen: (open: boolean) => void
  filteredDoctors: DoctorOption[]
  appointmentForm: {
    doctorId: string
    requestedTime: string
    reasonForVisit: string
  }
  setAppointmentForm: (form: {
    doctorId: string
    requestedTime: string
    reasonForVisit: string
  }) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  submittingAppointment: boolean
  editingAppointmentId: string | null
  appointmentMessage: string | null
  appointmentError: string | null
  onCancelEdit: () => void
  getTomorrowMinDateTime: () => string
}

export function AppointmentSchedulerForm({
  doctorLoading,
  doctorOptions,
  doctorSearchTerm,
  setDoctorSearchTerm,
  doctorDropdownOpen,
  setDoctorDropdownOpen,
  filteredDoctors,
  appointmentForm,
  setAppointmentForm,
  onSubmit,
  submittingAppointment,
  editingAppointmentId,
  appointmentMessage,
  appointmentError,
  onCancelEdit,
  getTomorrowMinDateTime,
}: AppointmentSchedulerFormProps) {
  return (
    <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
      <h3 className="text-lg font-semibold">
        {editingAppointmentId ? "Edit Appointment" : "Schedule Appointment"}
      </h3>
      <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={(event) => void onSubmit(event)}>
        <div className="space-y-2">
          <label className="text-sm font-medium">Doctor</label>
          <div className="relative">
            <Input
              value={doctorSearchTerm}
              onFocus={() => setDoctorDropdownOpen(true)}
              onBlur={() => {
                setTimeout(() => {
                  setDoctorDropdownOpen(false)
                }, 120)
              }}
              onChange={(event) => {
                if (editingAppointmentId) {
                  return
                }
                setDoctorSearchTerm(event.target.value)
                setDoctorDropdownOpen(true)
              }}
              placeholder={doctorLoading ? "Loading doctors..." : "Type doctor name or health ID"}
              disabled={doctorLoading || doctorOptions.length === 0 || Boolean(editingAppointmentId)}
            />
            {doctorDropdownOpen && !doctorLoading && doctorOptions.length > 0 ? (
              <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
                {filteredDoctors.length === 0 ? (
                  <p className="px-2 py-1 text-sm text-muted-foreground">No doctor matches found.</p>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <button
                      key={doctor.healthId}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault()
                      }}
                      onClick={() => {
                        setAppointmentForm({
                          ...appointmentForm,
                          doctorId: doctor.healthId,
                        })
                        setDoctorSearchTerm(`${doctor.label} (${doctor.healthId})`)
                        setDoctorDropdownOpen(false)
                      }}
                      className="w-full rounded px-2 py-1 text-left text-sm hover:bg-accent"
                    >
                      {doctor.label} ({doctor.healthId})
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date & Time</label>
          <Input
            type="datetime-local"
            value={appointmentForm.requestedTime}
            onChange={(event) =>
              setAppointmentForm({
                ...appointmentForm,
                requestedTime: event.target.value,
              })
            }
            min={getTomorrowMinDateTime()}
            required
          />
          <p className="text-xs text-muted-foreground">You can only book appointments from tomorrow onwards.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reason for Visit</label>
          <Input
            value={appointmentForm.reasonForVisit}
            onChange={(event) =>
              setAppointmentForm({
                ...appointmentForm,
                reasonForVisit: event.target.value,
              })
            }
            placeholder="Headache, follow-up, consultation..."
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <Button type="submit" disabled={submittingAppointment || doctorLoading}>
            {submittingAppointment
              ? editingAppointmentId
                ? "Updating..."
                : "Scheduling..."
              : editingAppointmentId
                ? "Update Appointment"
                : "Schedule Appointment"}
          </Button>
          {editingAppointmentId ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
            >
              Cancel Edit
            </Button>
          ) : null}
          {appointmentMessage ? <p className="text-sm text-emerald-600">{appointmentMessage}</p> : null}
          {appointmentError ? <p className="text-sm text-destructive">{appointmentError}</p> : null}
        </div>
      </form>
    </div>
  )
}
