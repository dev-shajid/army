'use client'

import * as React from "react"
import { BookOpen, ClipboardList, GraduationCap, Calendar, FileText, ChevronRight, Shield, LucideIcon } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
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
import { DEFAULT_REDIRECT_URL } from "@/route"
import Logo from "./logo"

interface ISidebarItem {
    title: string
    href?: string
    icon?: LucideIcon
    items?: ISidebarItem[]
}

// This is sample data.
const menuItems: ISidebarItem[] = [
    {
        title: "Dashboard",
        icon: BookOpen,
        href: "/",
    },
    {
        title: "SOP Policy",
        icon: BookOpen,
        href: "/sop-policy",
        items: [
            { title: "SOP", href: "/sop-policy/sop" },
            { title: "Policy", href: "/sop-policy/policy" },
        ],
    },
    {
        title: "Duty Roster",
        icon: Calendar,
        items: [{ title: "Assign/View Duty", href: "/duty-roster" }],
    },
    {
        title: "Routine Orders",
        icon: FileText,
        items: [
            { title: "Part 1 & Part 2", href: "/parts" },
        ],
    },
    {
        title: "Preci",
        icon: FileText,
        href: "/preci",
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    function isItemActive(item: ISidebarItem): boolean {
        return item.href == pathname ||
            (item.items ? item.items.some(isItemActive) : false)
    }

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b border-sidebar-border">
                <Link href={DEFAULT_REDIRECT_URL}>
                    <div className="flex gap-2 items-center px-2">
                        <Logo size={40} />
                        <span className="text-lg font-semibold text-sidebar-foreground">SOP & Duty Manuals</span>
                    </div>
                </Link>
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
                                                {item.href && pathname != item.href ?
                                                    <Link href={item.href ?? '#'}>
                                                        <SidebarMenuButton>
                                                            {item.icon && <item.icon />}
                                                            <span>{item.title}</span>
                                                            <ChevronRight
                                                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                                            />
                                                        </SidebarMenuButton>
                                                    </Link> :
                                                    <SidebarMenuButton
                                                        className="cursor-pointer"
                                                        isActive={Boolean(item.href) && isItemActive(item)}
                                                    >
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                        <ChevronRight
                                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                                        />
                                                    </SidebarMenuButton>}
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.map((item) => (
                                                        <SidebarMenuSubItem key={item.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={isItemActive(item)}
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
