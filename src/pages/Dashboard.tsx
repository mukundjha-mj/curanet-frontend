import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart,
  Calendar,
  Bell,
  Search,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const menuItems = [
  { icon: Home, label: "Home", isActive: false },
  { icon: LayoutDashboard, label: "Dashboard", isActive: true },
  { icon: Users, label: "Users", isActive: false },
  { icon: FileText, label: "Documents", isActive: false },
  { icon: BarChart, label: "Analytics", isActive: false },
  { icon: Calendar, label: "Calendar", isActive: false },
]

const bottomMenuItems = [
  { icon: Settings, label: "Settings", isActive: false },
]

export function Dashboard() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Curanet</span>
              <span className="text-xs text-muted-foreground">Frontend</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            {bottomMenuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton tooltip={item.label}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <div className="px-2 py-1">
            <div className="flex items-center gap-2 rounded-md bg-sidebar-accent px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                U
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-medium">User</span>
                <span className="text-muted-foreground">Role</span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 h-9"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon-sm">
            <Bell className="h-4 w-4" />
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to Curanet Frontend
            </p>
          </div>

          {/* Dashboard Content Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards */}
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Users
                </span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">2,543</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12% from last month
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Documents
                </span>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +8% from last month
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Analytics
                </span>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">89.2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +2.5% from last month
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Events
                </span>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3 upcoming this week
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New document uploaded</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      project-specs.pdf was added to Documents
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-b">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      john.doe@example.com joined the platform
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      5 hours ago
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BarChart className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Analytics report ready</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monthly performance report is available
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      1 day ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
