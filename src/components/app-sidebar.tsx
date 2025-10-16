'use client'

import * as React from "react"
import { BookOpen, ClipboardList, GraduationCap, Calendar, FileText, ChevronRight, Shield, LucideIcon } from "lucide-react"
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


import Link from "next/link"
import { usePathname } from "next/navigation"
import AppSidebarUser from "./app-sidebar-user"

interface ISidebarItem {
    title: string
    href?: string
    icon?: LucideIcon
    items?: ISidebarItem[]
}

// This is sample data.
const menuItems: ISidebarItem[] = [
    {
        title: "SOP Library",
        icon: BookOpen,
        href: "/sop-library",
        // items: [{ title: "View SOPs", href: "/sop-library" }],
    },
    {
        title: "Duty Manual",
        icon: ClipboardList,
        items: [{ title: "Check Duties", href: "/duty-manual" }],
    },
    {
        title: "Training",
        icon: GraduationCap,
        items: [
            { title: "Take Quiz", href: "/training/quiz" },
            { title: "Show Result", href: "/training/results" },
        ],
    },
    {
        title: "Duty Roster",
        icon: Calendar,
        items: [{ title: "Assign/View Duty", href: "/duty-roster" }],
    },
    {
        title: "Routing Orders",
        icon: FileText,
        items: [
            { title: "Read & Ack", href: "/routing-orders" },
            { title: "Sync Reports", href: "/routing-orders/sync" },
        ],
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    function isItemActive(item: ISidebarItem): boolean {
        return item.href === pathname ||
            (item.items ? item.items.some(isItemActive) : false)
    }

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 px-4 py-3">
                    <Shield className="h-6 w-6 text-sidebar-primary" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-sidebar-foreground">Army Dashboard</span>
                        <span className="text-xs text-sidebar-foreground/60">Operations Management</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map((item, index) => (
                            <Collapsible
                                key={item.title}
                                defaultOpen={index === 1}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    {item.items?.length ? (
                                        <>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton className="cursor-pointer">
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.map((item) => (
                                                        <SidebarMenuSubItem key={item.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={isItemActive(item)}
                                                            // className="data-[active=true]:bg-indigo-100/80 data-[active=true]:text-indigo-700 data-[active=true]:hover:bg-indigo-100 cursor-pointer"
                                                            >
                                                                <Link href={item.href ?? '#'}>
                                                                    {item.title}
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </>
                                    ) :
                                        <Link href={item.href ?? '#'}>
                                            <SidebarMenuButton
                                                isActive={isItemActive(item)}
                                            // className="data-[active=true]:bg-indigo-100/80 data-[active=true]:text-indigo-700 data-[active=true]:hover:bg-indigo-100 dark:data-[active=true]:bg-indigo-900/20 dark:data-[active=true]:text-indigo-400 cursor-pointer"
                                            >
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </Link>
                                    }
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <AppSidebarUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
