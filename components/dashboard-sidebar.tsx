"use client"

import { useSession } from "next-auth/react";
import { Activity } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
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
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Tooltip, TooltipContent, TooltipHint, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { Fragment, useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Staff } from "@/lib/database/types";

interface DashboardSidebarProps {
  navigationItems: {
    name: string;
    icon: any;
    id: string;
  }[];
  activeTab: string;
}

export function DashboardSidebar({ navigationItems, activeTab }: DashboardSidebarProps) {
  const { t } = useI18n();
  const sidebar = useSidebar()

  const session = useSession()

  const [groupedItems, setGroupedItems] = useState({
    DASHBOARD: ["overview", "settings"],
  });

  useEffect(() => {
    if (session.status == "authenticated") {
      const role = (session.data.user as any).role as Staff["role"];
      const groupedItems = {
        DASHBOARD:
          role === "admin" ? ["overview", "patients", "staff", "appointments", "prescriptions", "samples", "radio", "analysis", "research", "invoice", "settings"] :
            role == "medecin" ? ["overview", "patients", "appointments", "samples", "prescriptions", "research", "radio", "settings"] :
              role == "reception" ? ["overview", "patients", "appointments", "settings"] :
                role == "infirmier" ? ["overview", "patients", "appointments", "samples", "settings"] :
                  role == "radiologue" ? ["overview", "patients", "appointments", "radio", "settings"] :
                    role == "laborantin" ? ["overview", "analysis", "settings"] :
                      role == "comptable" ? ["overview", "invoice", "reports", "settings"] :
                        role == "patient" ? ["overview", "prescriptions", "invoice", "settings"] : []
      };
      setGroupedItems(groupedItems);
    }
  }, [session])

  return (
    <Sidebar {...sidebar} collapsible="icon">
      <SidebarHeader className="py-0">
        <SidebarMenu>
          <div className="h-16 border-b flex items-center px-2 group-data-[collapsible=icon]:px-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-[#4469BA] flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-[#111827] group-data-[collapsible=icon]:hidden">MediCare</span>
            </Link>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">

        {/* Clinic Info */}
        <div className="p-2 group-data-[collapsible=icon]:hidden min-h-min min-w-min text-nowrap">
          <div className="flex p-3 items-center border rounded-lg gap-3">
            <div className="h-8 w-8 rounded-md bg-gray-200 flex items-center justify-center">
              <Activity className="h-5 w-5 text-[#4469BA]" />
            </div>
            <div>
              <div className="font-medium text-sm text-[#111827]">Clinic USTHB</div>
              <div className="text-xs text-gray-500">In front of the university</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {Object.entries(groupedItems).map(([category, items], index) => (
          <Fragment key={category}>
            <SidebarGroup>
              <SidebarGroupLabel>{category}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems
                    .filter((item) => items.includes(item.id))
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <TooltipHint disabled={sidebar.open} text={t(`navigation.${item.id}`)}>
                            <SidebarMenuButton
                              data-active={isActive}
                              className="gap-2"
                              asChild>
                              <Link href={`/dashboard/${item.id}`}>
                                <Icon className="h-5 w-5" />
                                <span>
                                  {t(`navigation.${item.id}`)}
                                </span>
                              </Link>
                            </SidebarMenuButton>
                          </TooltipHint>
                        </SidebarMenuItem>
                      );
                    })}
                  {
                    session.status == "loading" && new Array(4).fill(0).map((_, i) => (
                      <SidebarMenuItem key={i}>
                        <SidebarMenuButton disabled variant={"outline"} asChild>
                          <Skeleton className="bg-gray-300" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  }
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </Fragment>
        ))}
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg bg-gray-100 p-3 min-w-min min-h-min text-nowrap overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#4469BA] p-1">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#111827]">Need Help?</p>
              <p className="text-xs text-gray-500">Contact support</p>
            </div>
          </div>
          <Button variant="outline" className="mt-3 w-full text-xs">
            Support Center
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
