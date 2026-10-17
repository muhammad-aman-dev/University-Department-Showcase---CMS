import { getCurrentUser } from "@/lib/getCurrentUser";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Users, 
  GraduationCap, 
  FolderKanban, 
  Newspaper, 
  ShieldCheck, 
  Compass, 
  FileText,
  CalendarDays
} from "lucide-react";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  const environment = process.env.NEXT_PUBLIC_APP_ENV || "development";

  const quickLinks = [
    {
      title: "Faculty Directory",
      description: "Manage department professors and staff profiles.",
      href: "/admin/faculty",
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Academic Programs",
      description: "Update undergraduate and graduate course offerings.",
      href: "/admin/programs",
      icon: GraduationCap,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Student Projects",
      description: "Review and publish student capstones and showcases.",
      href: "/admin/projects",
      icon: FolderKanban,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "News & Announcements",
      description: "Publish latest department achievements and news.",
      href: "/admin/news",
      icon: Newspaper,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Banner with Visuals & Animation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8 text-white shadow-xl">
        {/* Decorative background glow & floating shapes */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute right-20 -bottom-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono text-blue-200">
              <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
              <span>Welcome Portal • CS Department</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Hello, {user?.name || "Administrator"} 👋
            </h1>
            
            <p className="text-sm text-blue-100/80 leading-relaxed font-sans">
              You are logged in as <span className="font-semibold text-white uppercase tracking-wider text-xs px-2 py-0.5 rounded bg-white/10 ml-1">{user?.role?.replace("_", " ") || "Admin"}</span>. Use this centralized command center to manage academics, research publications, website content, and department announcements seamlessly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono text-white shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Env: <span className="font-semibold uppercase">{environment}</span></span>
            </div>
            
            <Link
              href="/admin/homepage"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 text-xs font-bold hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Manage Website</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Shortcut Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-2">
            <Compass size={14} className="text-blue-600" />
            Quick Module Access
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.color} shadow-xs transition group-hover:scale-110`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-600 transition group-hover:translate-x-0.5">
                      <ArrowRight size={16} />
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 font-sans group-hover:text-blue-600 transition">
                    {item.title}
                  </h3>
                  
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Status & Guidelines Footer Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-mono">
              System Security & Integrity Active
            </h2>
            <p className="mt-1 text-xs text-gray-500 max-w-2xl leading-relaxed">
              All administrative actions are logged securely. Ensure you log out of your session when finished working on shared terminals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600">
            <CalendarDays size={14} className="text-gray-400" />
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
}