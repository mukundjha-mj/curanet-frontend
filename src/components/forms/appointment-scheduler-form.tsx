import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react"
import { addDays } from "date-fns"
import { Clock2Icon } from "lucide-react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
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
  pendingContent?: ReactNode
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
  pendingContent,
}: AppointmentSchedulerFormProps) {
  const timePickerRef = useRef<HTMLDivElement | null>(null)
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false)

  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )

  const selectedDate = useMemo(() => {
    if (!appointmentForm.requestedTime) {
      return undefined
    }

    const [datePart] = appointmentForm.requestedTime.split("T")
    if (!datePart) {
      return undefined
    }

    const parsed = new Date(`${datePart}T00:00:00`)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }, [appointmentForm.requestedTime])

  const selectedTime = useMemo(() => {
    if (!appointmentForm.requestedTime.includes("T")) {
      return "09:00"
    }

    const [, timePart] = appointmentForm.requestedTime.split("T")
    if (!timePart || !/^\d{2}:\d{2}$/.test(timePart)) {
      return "09:00"
    }

    return timePart
  }, [appointmentForm.requestedTime])

  const minDate = useMemo(() => {
    const minDateTime = getTomorrowMinDateTime()
    const [datePart] = minDateTime.split("T")
    const parsed = new Date(`${datePart}T00:00:00`)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }, [getTomorrowMinDateTime])

  const presets = useMemo(
    () => [
      { label: "Tomorrow", value: 1 },
      { label: "In 3 days", value: 3 },
      { label: "In a week", value: 7 },
      { label: "In 2 weeks", value: 14 },
    ],
    []
  )

  const hourOptions = useMemo(
    () => Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0")),
    []
  )

  const minuteOptions = useMemo(
    () => Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0")),
    []
  )

  const periodOptions = useMemo(() => ["AM", "PM"], [])

  const selectedTimeParts = useMemo(() => {
    const [hourPart = "09", minutePart = "00"] = selectedTime.split(":")
    const hour24 = Number.parseInt(hourPart, 10)

    if (Number.isNaN(hour24)) {
      return { hour12: "09", minute: "00", period: "AM" as const }
    }

    const period = hour24 >= 12 ? "PM" : "AM"
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12

    return {
      hour12: String(hour12).padStart(2, "0"),
      minute: /^\d{2}$/.test(minutePart) ? minutePart : "00",
      period,
    }
  }, [selectedTime])

  const selectedTimeLabel = useMemo(() => {
    return `${selectedTimeParts.hour12}:${selectedTimeParts.minute} ${selectedTimeParts.period}`
  }, [selectedTimeParts])

  const updateTimeFromParts = ({
    hour12,
    minute,
    period,
  }: {
    hour12?: string
    minute?: string
    period?: "AM" | "PM"
  }) => {
    const resolvedHour12 = Number.parseInt(hour12 ?? selectedTimeParts.hour12, 10)
    const resolvedMinute = minute ?? selectedTimeParts.minute
    const resolvedPeriod = period ?? selectedTimeParts.period

    if (Number.isNaN(resolvedHour12)) {
      return
    }

    let hour24 = resolvedHour12 % 12
    if (resolvedPeriod === "PM") {
      hour24 += 12
    }

    updateRequestedTime({
      time: `${String(hour24).padStart(2, "0")}:${resolvedMinute}`,
    })
  }

  useEffect(() => {
    if (!timeDropdownOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!timePickerRef.current) {
        return
      }

      if (event.target instanceof Node && !timePickerRef.current.contains(event.target)) {
        setTimeDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [timeDropdownOpen])

  const formatDatePart = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const updateRequestedTime = ({
    date,
    time,
  }: {
    date?: Date
    time?: string
  }) => {
    const resolvedDate = date ?? selectedDate
    if (!resolvedDate) {
      return
    }

    const resolvedTime = time ?? selectedTime

    setAppointmentForm({
      ...appointmentForm,
      requestedTime: `${formatDatePart(resolvedDate)}T${resolvedTime}`,
    })
  }

  return (
    <div className="md:min-h-min">
      <h3 className="text-lg font-semibold">
        {editingAppointmentId ? "Edit Appointment" : "Schedule Appointment"}
      </h3>
      <form className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-start" onSubmit={(event) => void onSubmit(event)}>
        <Card className="h-fit lg:col-start-1 lg:row-start-1" size="sm">
          <CardContent className="space-y-4">
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

            <div className="flex flex-wrap items-center gap-2">
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
          </CardContent>
        </Card>

        {pendingContent ? (
          <div className="lg:col-start-1 lg:row-start-2">{pendingContent}</div>
        ) : null}

        <Card className="h-fit lg:col-start-2 lg:row-start-1 lg:row-span-2" size="sm">
          <CardContent className="space-y-2">
            <label className="text-sm font-medium">Date & Time</label>
            <div className="grid items-start gap-3 lg:grid-cols-[280px_188px]">
              <Card className="mx-auto w-fit max-w-[280px] lg:ml-0" size="sm">
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (!date) {
                        return
                      }

                      updateRequestedTime({ date })
                    }}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    disabled={(date) => {
                      if (!minDate) {
                        return false
                      }

                      return date < minDate
                    }}
                    showOutsideDays={false}
                    fixedWeeks={false}
                    className="p-0 [--cell-size:--spacing(8.5)]"
                  />
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 border-t">
                  {presets.map((preset) => (
                    <Button
                      key={preset.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const newDate = addDays(new Date(), preset.value)
                        updateRequestedTime({ date: newDate })
                        setCurrentMonth(
                          new Date(newDate.getFullYear(), newDate.getMonth(), 1)
                        )
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </CardFooter>
              </Card>

              <div className="w-[188px] space-y-3">
                <FieldGroup>
                  <Field>
                    <FieldLabel className="cursor-default select-none">Time</FieldLabel>
                    <div className="relative" ref={timePickerRef}>
                      <button
                        id="appointment-time"
                        type="button"
                        onClick={() => setTimeDropdownOpen((previousState) => !previousState)}
                        className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-card px-2.5 text-sm text-foreground transition-colors hover:border-ring/60"
                      >
                        <span>{selectedTimeLabel}</span>
                        <span className="flex items-center gap-1 border-l border-border pl-2 text-muted-foreground">
                          <Clock2Icon className="size-4" />
                          <ChevronDownIcon className={`size-4 transition-transform ${timeDropdownOpen ? "rotate-180" : ""}`} />
                        </span>
                      </button>

                      {timeDropdownOpen ? (
                        <div className="absolute z-30 mt-0.5 max-h-[320px] w-full overflow-hidden rounded-lg border border-border bg-popover shadow-xl">
                          <div className="grid h-full grid-cols-3 divide-x divide-border">
                            <div className="max-h-[320px] overflow-y-auto p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                              {hourOptions.map((hour) => (
                                <button
                                  key={hour}
                                  type="button"
                                  onClick={() => updateTimeFromParts({ hour12: hour })}
                                  className={`w-full rounded px-2 py-1.5 text-center text-sm transition-colors ${selectedTimeParts.hour12 === hour ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent/60"}`}
                                >
                                  {hour}
                                </button>
                              ))}
                            </div>

                            <div className="max-h-[320px] overflow-y-auto p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                              {minuteOptions.map((minute) => (
                                <button
                                  key={minute}
                                  type="button"
                                  onClick={() => updateTimeFromParts({ minute })}
                                  className={`w-full rounded px-2 py-1.5 text-center text-sm transition-colors ${selectedTimeParts.minute === minute ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent/60"}`}
                                >
                                  {minute}
                                </button>
                              ))}
                            </div>

                            <div className="max-h-[320px] overflow-y-auto p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                              {periodOptions.map((period) => (
                                <button
                                  key={period}
                                  type="button"
                                  onClick={() => updateTimeFromParts({ period: period as "AM" | "PM" })}
                                  className={`w-full rounded px-2 py-1.5 text-center text-sm transition-colors ${selectedTimeParts.period === period ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent/60"}`}
                                >
                                  {period}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Field>
                </FieldGroup>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">You can only book appointments from tomorrow onwards.</p>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
