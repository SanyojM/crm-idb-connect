"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
// import lucide icons type
export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ComponentType<any>
  }[]
}) {
  const currentRoute = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
            {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
              tooltip={item.title}
              className={item.url === currentRoute ? "bg-primary text-primary-foreground" : ""}
              >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
