"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboardIcon, 
  FileTextIcon, 
  CalendarIcon, 
  AlertCircleIcon, 
  ShieldCheckIcon, 
  Settings2Icon, 
  LifeBuoyIcon, 
  SendIcon, 
  UsersIcon, 
  FolderIcon,
  HeartPulseIcon 
} from "lucide-react"

const data = {
  user: {
    name: "Mukund Jha",
    email: "mukund@curanet.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon />
      ),
    },
    {
      title: "Medical Records",
      url: "/records",
      icon: (
        <FileTextIcon />
      ),
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: (
        <CalendarIcon />
      ),
    },
    {
      title: "Emergency",
      url: "/emergency",
      icon: (
        <AlertCircleIcon />
      ),
    },
    {
      title: "Consent Management",
      url: "/consent",
      icon: (
        <ShieldCheckIcon />
      ),
    },
    {
      title: "Account Settings",
      url: "/settings",
      icon: (
        <Settings2Icon />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: (
        <LifeBuoyIcon />
      ),
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: (
        <SendIcon />
      ),
    },
  ],
  projects: [
    {
      name: "My Health Data",
      url: "/projects/health-data",
      icon: (
        <HeartPulseIcon />
      ),
    },
    {
      name: "Family Members",
      url: "/projects/family",
      icon: (
        <UsersIcon />
      ),
    },
    {
      name: "Shared Records",
      url: "/projects/shared",
      icon: (
        <FolderIcon />
      ),
    },
  ],
}

type AppSidebarUser = {
  name?: string
  email?: string
  avatar?: string
}

export function AppSidebar({
  user,
  activePath = "/dashboard/overview",
  onNavigate,
  onItemHover,
  loading = false,
  pendingConsentCount = 0,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: AppSidebarUser
  activePath?: string
  onNavigate?: (path: string) => void
  onItemHover?: (url: string) => void
  loading?: boolean
  pendingConsentCount?: number
}) {
  const resolvedUser = {
    ...data.user,
    ...user,
    avatar: user?.avatar ?? data.user.avatar,
  }

  const navMainItems = data.navMain.map((item) =>
    item.url === "/consent" ? { ...item, badge: pendingConsentCount } : item
  )

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img
                    src="/CuraNet.png"
                    alt="CuraNet logo"
                    className="size-5 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CuraNet</span>
                  <span className="truncate text-xs">Healthcare Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navMainItems}
          activePath={activePath}
          onNavigate={(path) => onNavigate?.(path)}
          onItemHover={onItemHover}
        />
        <NavProjects
          projects={data.projects}
          activePath={activePath}
          onNavigate={(path) => onNavigate?.(path)}
        />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
          activePath={activePath}
          onNavigate={(path) => onNavigate?.(path)}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={resolvedUser} loading={loading} />
      </SidebarFooter>
    </Sidebar>
  )
}
