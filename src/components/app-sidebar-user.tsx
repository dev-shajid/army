import React, { useEffect } from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { ChevronsUpDown, Key, LogOut } from 'lucide-react'
import { getCurrentUser, logout } from '@/services/auth.service'
import { useUserStore } from '@/hooks/use-user-store'
import { useOverlay } from '@/hooks/use-overlay'
import { toast } from 'sonner'
import { AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { AUTH_REDIRECT_URL, DEFAULT_REDIRECT_URL } from '@/route'
import Link from 'next/link'
import { Skeleton } from './ui/skeleton'

export default function AppSidebarUser() {
    const { isMobile } = useSidebar()
    const userStore = useUserStore()
    const { showOverlay, hideOverlay } = useOverlay()
    const router = useRouter()

    async function handleCurrentUser() {
        const user = await getCurrentUser()
        userStore.login(user)
    }

    useEffect(() => {
        handleCurrentUser()
    }, [])

    async function handleLogout() {
        try {
            showOverlay()
            await logout()
            userStore.logout()
            router.push(AUTH_REDIRECT_URL)
        } catch (error) {
            toast.error("Error", {
                description: (error as AuthError).message ?? 'Failed to logout. Please try again.'
            })
            hideOverlay()
        }
    }

    return (
        <>
            <SidebarMenu>
                {
                    userStore.user ?
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg border-foreground">
                                            <AvatarImage src={userStore.user?.user_metadata?.avatar} alt={userStore.user?.user_metadata?.name} />
                                            <AvatarFallback className="rounded-lg bg-sidebar-primary">
                                                {userStore.user?.user_metadata?.name
                                                    ?.split(' ')
                                                    .map((n: string) => n[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{userStore.user?.user_metadata?.name}</span>
                                            <span className="truncate text-xs">{userStore.user?.email}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                    side={isMobile ? "bottom" : "right"}
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage src={userStore.user?.user_metadata?.avatar} alt={userStore.user?.user_metadata?.name} />
                                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{userStore.user?.user_metadata?.name}</span>
                                                <span className="truncate text-xs">{userStore.user?.email ?? ''}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem href='/profile'>
                                        <Key />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        variant='destructive'
                                        onClick={handleLogout}
                                    >
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                        :
                        <SidebarMenuItem>
                            {/* Add skeleton loading */}
                            <Skeleton className='w-full h-8 rounded-md' />
                        </SidebarMenuItem>
                }
            </SidebarMenu>
        </>
    )
}
