"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/api/auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Buat Surat Jalan",
        url: "/dashboard/create-work-permit",
        icon: IconDashboard,
      },
      {
        title: "Pembelian & Penjualan Barang",
        url: "/dashboard/inventory-tracking",
        icon: IconListDetails,
      },
      {
        title: "Uang Masuk & Keluar",
        url: "/dashboard/money-tracking",
        icon: IconChartBar,
      },
      {
        title: "List Pekerjaan",
        url: "/dashboard/job-list",
        icon: IconFolder,
      },
      {
        title: "Data Karyawan ",
        url: "/dashboard/employees",
        icon: IconUsers,
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/dashboard/setting",
        icon: IconSettings,
      },
    ],
    documents: [
      {
        name: "Pekerjaan Harian",
        url: "/dashboard/daily-job",
        icon: IconDatabase,
      },
      {
        name: "Absensi kehadiran",
        url: "/dashboard/attendance",
        icon: IconReport,
      },
      // {
      //   name: "Word Assistant",
      //   url: "#",
      //   icon: IconFileWord,
      // },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  Khalil Jaya Teknik
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
