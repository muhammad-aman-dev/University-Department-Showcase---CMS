"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  Info,
  Settings,
  Users,
  GraduationCap,
  FolderKanban,
  Trophy,
  FlaskConical,
  Search,
  BookOpen,
  Building2,
  Newspaper,
  CalendarDays,
  Bell,
  Images,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },

  {
    title: "Website",
    items: [
      {
        label: "Homepage",
        href: "/admin/homepage",
        icon: Home,
      },
      {
        label: "About Department",
        href: "/admin/about",
        icon: Info,
      },
      {
        label: "Site Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },

  {
    title: "Academic",
    items: [
      {
        label: "Faculty",
        href: "/admin/faculty",
        icon: Users,
      },
      {
        label: "Programs",
        href: "/admin/programs",
        icon: GraduationCap,
      },
      {
        label: "Student Projects",
        href: "/admin/projects",
        icon: FolderKanban,
      },
    ],
  },

  {
    title: "Research",
    items: [
      {
        label: "Research Areas",
        href: "/admin/research/areas",
        icon: Search,
      },
      {
        label: "Research Projects",
        href: "/admin/research/projects",
        icon: FlaskConical,
      },
      {
        label: "Publications",
        href: "/admin/publications",
        icon: BookOpen,
      },
      {
        label: "Laboratories",
        href: "/admin/laboratories",
        icon: Building2,
      },
    ],
  },

  {
    title: "Content",
    items: [
      {
        label: "Achievements",
        href: "/admin/achievements",
        icon: Trophy,
      },
      {
        label: "News",
        href: "/admin/news",
        icon: Newspaper,
      },
      {
        label: "Events",
        href: "/admin/events",
        icon: CalendarDays,
      },
      {
        label: "Notices",
        href: "/admin/notices",
        icon: Bell,
      },
      {
        label: "Gallery",
        href: "/admin/gallery",
        icon: Images,
      },
    ],
  },

  {
    title: "Communication",
    items: [
      {
        label: "Messages",
        href: "/admin/messages",
        icon: Mail,
      },
    ],
  },
];

export default function AdminShell({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Logout failed");
        return;
      }

      toast.success("Logged out successfully");

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong");
    }
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo / Department */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              CS Department
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-5">
            {navigation.map((section) => {
              if (section.href) {
                const Icon = section.icon;

                const active =
                  pathname === section.href;

                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    {section.label}
                  </Link>
                );
              }

              return (
                <div key={section.title}>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {section.title}
                  </p>

                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;

                      const active =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeSidebar}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                            active
                              ? "bg-gray-900 font-medium text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <Icon size={18} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Super Admin only */}
            {user?.role === "super_admin" && (
              <div>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  System
                </p>

                <Link
                  href="/admin/users"
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    pathname.startsWith("/admin/users")
                      ? "bg-gray-900 font-medium text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Users size={18} />
                  Users
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar user */}
        <div className="shrink-0 border-t p-3">
          <div className="mb-3 rounded-lg bg-gray-50 p-3">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.name}
            </p>

            <p className="truncate text-xs text-gray-500">
              {user?.email}
            </p>

            <p className="mt-1 text-xs font-medium capitalize text-gray-500">
              {user?.role?.replace("_", " ")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mr-4 rounded-md p-2 hover:bg-gray-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Admin Panel
            </h2>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setUserMenuOpen((prev) => !prev)
              }
              className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-100"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>

                <p className="text-xs text-gray-500">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>

              <ChevronDown size={16} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}