import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  activePath,
  onNavigate,
  onItemHover,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    badge?: number
  }[]
  activePath: string
  onNavigate: (path: string) => void
  onItemHover?: (url: string) => void
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={activePath === item.url}
            >
              <a
                className="flex w-full items-center gap-2"
                href={item.url}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate(item.url)
                }}
                onMouseEnter={() => {
                  onItemHover?.(item.url)
                }}
              >
                {item.icon}
                <span className="flex-1">{item.title}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
