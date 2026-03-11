interface RecordDetailDialogContentProps {
  selectedRecord: {
    type: "encounter" | "observation"
    data: Record<string, unknown>
  }
  formatDateTime: (dateStr: string) => string
  formatFieldName: (key: string) => string
  formatRecordDetailValue: (value: unknown) => string
}

export default function RecordDetailDialogContent({
  selectedRecord,
  formatDateTime,
  formatFieldName,
  formatRecordDetailValue,
}: RecordDetailDialogContentProps) {
  return (
    <div className="space-y-3">
      {Object.entries(selectedRecord.data)
        .filter(([key]) => key !== "id")
        .map(([key, value]) => {
          if (key === "providerId") {
            const role = (selectedRecord.data as Record<string, string | undefined>).createdByRole
            const roleLabel = role
              ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
              : "Provider"
            return (
              <div key={key} className="rounded-md border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Provider</p>
                <p className="mt-1 text-sm font-medium">{roleLabel}</p>
              </div>
            )
          }

          if (key === "observations" && Array.isArray(value)) {
            return (
              <div key={key} className="rounded-md border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Observations ({value.length})
                </p>
                <div className="mt-2 space-y-2">
                  {value.map((observation, idx) => {
                    const obs = observation as {
                      code?: string
                      recordedAt?: string
                      value?: Record<string, unknown>
                      verificationStatus?: string
                    }
                    return (
                      <div key={idx} className="rounded-md bg-muted/30 p-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {obs.code || "Observation"} - {obs.recordedAt ? formatDateTime(obs.recordedAt) : ""}
                        </p>
                        {obs.value ? (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {Object.entries(obs.value).map(([vKey, vVal]) => (
                              <div key={vKey} className="text-sm">
                                <span className="font-medium">{formatFieldName(vKey)}:</span> <span>{String(vVal)}</span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {obs.verificationStatus ? (
                          <p className="mt-1 text-xs text-muted-foreground">Status: {obs.verificationStatus}</p>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          if (key === "value" && value && typeof value === "object" && !Array.isArray(value)) {
            return (
              <div key={key} className="rounded-md border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Measurements</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.entries(value as Record<string, unknown>).map(([vKey, vVal]) => (
                    <div key={vKey} className="text-sm">
                      <span className="font-medium">{formatFieldName(vKey)}:</span> <span>{String(vVal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          if (["createdById", "createdByRole", "deviceMetadata", "verificationNotes", "verifiedByDoctorId"].includes(key) && !value) {
            return null
          }

          return (
            <div key={key} className="rounded-md border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{formatFieldName(key)}</p>
              <p className="mt-1 text-sm font-medium">{formatRecordDetailValue(value)}</p>
            </div>
          )
        })}
    </div>
  )
}