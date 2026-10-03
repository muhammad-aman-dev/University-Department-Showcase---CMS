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
  ShieldAlert,
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-gray-900 font-sans">
                CS Department
              </h1>
              <p className="text-[11px] text-gray-500">Admin Console</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <div className="space-y-6">
            {navigation.map((section) => {
              if (section.href) {
                const Icon = section.icon;
                const active = pathname === section.href;

                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={18} />
                    {section.label}
                  </Link>
                );
              }

              return (
                <div key={section.title}>
                  <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
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
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                            active
                              ? "bg-blue-600 font-semibold text-white shadow-sm shadow-blue-100"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <Icon size={17} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {user?.role === "super_admin" && (
              <div>
                <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                  System
                </p>

                <Link
                  href="/admin/users"
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    pathname.startsWith("/admin/users")
                      ? "bg-blue-600 font-semibold text-white shadow-sm shadow-blue-100"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Users size={17} />
                  Users
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="shrink-0 border-t border-gray-200 p-3 bg-gray-50/50">
          <div className="mb-3 rounded-lg bg-white border border-gray-200 p-3 shadow-xs">
            <p className="truncate text-xs font-semibold text-gray-900">
              {user?.name}
            </p>

            <p className="truncate text-[11px] text-gray-500 mt-0.5">
              {user?.email}
            </p>

            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
              {user?.role?.replace("_", " ")}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={17} />
            Logout Session
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 lg:px-6 shadow-xs">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1">
            <h2 className="text-sm font-bold text-gray-900 font-sans uppercase tracking-wider">
              Management Dashboard
            </h2>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-inner">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-[10px] font-mono text-gray-500 uppercase">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>

              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                >
                  <LogOut size={15} />
                  Logout Session
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}