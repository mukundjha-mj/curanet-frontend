import { LogOutIcon, SettingsIcon, BellIcon, CreditCardIcon, CrownIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProfileMenuProps {
  userName?: string
  userEmail?: string
  onOpenProfile: () => void
  onLogout: () => void
  loading?: boolean
}

export function ProfileMenu({
  userName = "User",
  userEmail = "user@email.com",
  onOpenProfile,
  onLogout,
  loading = false,
}: ProfileMenuProps) {
  const firstLetter = userName.charAt(0).toUpperCase() || "U"

  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full">
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer">
          {firstLetter}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <p className="text-sm font-semibold">{userName}</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpenProfile} className="cursor-pointer">
          <SettingsIcon className="mr-2 h-4 w-4" />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed">
          <CreditCardIcon className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed">
          <BellIcon className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed">
          <CrownIcon className="mr-2 h-4 w-4" />
          <span>Upgrade to Pro</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
