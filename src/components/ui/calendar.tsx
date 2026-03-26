import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="around"
      className={cn("relative p-2", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col gap-3",
        month: "mx-auto grid w-fit grid-cols-[1.75rem_auto_1.75rem] items-center gap-x-2 gap-y-3",
        month_caption: "col-start-2 row-start-1 flex h-8 items-center justify-center",
        caption_label: "text-sm font-semibold",
        nav: "hidden",
        button_previous:
          "col-start-1 row-start-1 inline-flex h-7 w-7 items-center justify-center rounded-md border bg-background/80 p-0 opacity-80 hover:opacity-100",
        button_next:
          "col-start-3 row-start-1 inline-flex h-7 w-7 items-center justify-center rounded-md border bg-background/80 p-0 opacity-80 hover:opacity-100",
        month_grid: "col-span-3 row-start-2 w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground",
        weeks: "mt-2",
        week: "mt-2 flex w-full",
        day: "relative h-9 w-9 p-0 text-center text-sm",
        day_button: "h-9 w-9 rounded-md p-0 font-normal hover:bg-accent",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "border border-primary/40 bg-accent text-accent-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "pointer-events-none bg-muted/30 text-muted-foreground opacity-25 line-through",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeftIcon className="h-4 w-4" {...iconProps} />
          ) : (
            <ChevronRightIcon className="h-4 w-4" {...iconProps} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
