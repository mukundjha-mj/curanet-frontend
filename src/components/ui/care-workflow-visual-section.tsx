import CareWorkflowVisualization from "@/components/ui/care-workflow-visualization"

export function CareWorkflowVisualSection() {
  return (
    <section className="overflow-hidden bg-background px-3 pb-8 sm:px-6 md:pb-10">
      <div className="mx-auto max-w-7xl overflow-hidden p-0 sm:p-2 md:p-3">
        <div className="mx-auto flex w-full justify-center">
          <CareWorkflowVisualization className="h-[258px] max-w-[360px] sm:h-[320px] sm:max-w-[760px] md:h-[450px] md:max-w-[900px]" />
        </div>
      </div>
    </section>
  )
}
