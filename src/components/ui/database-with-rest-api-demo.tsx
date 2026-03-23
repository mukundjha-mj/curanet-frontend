import DatabaseWithRestApi from "@/components/ui/database-with-rest-api"

export function DatabaseWithRestApiDemo() {
  return (
    <section className="overflow-hidden bg-background px-6 pb-8 md:pb-10">
      <div className="mx-auto max-w-7xl overflow-hidden p-2 md:p-3">
        <div className="mx-auto flex w-full justify-center">
          <DatabaseWithRestApi className="h-[400px] max-w-[760px] md:h-[450px] md:max-w-[900px]" />
        </div>
      </div>
    </section>
  )
}
