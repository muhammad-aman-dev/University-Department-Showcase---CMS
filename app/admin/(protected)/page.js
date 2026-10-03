import { getCurrentUser } from "@/lib/getCurrentUser";
import { Users, GraduationCap, FolderKanban, Newspaper } from "lucide-react";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  const environment = process.env.NEXT_PUBLIC_APP_ENV || "development";

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 font-sans uppercase">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Welcome back, <span className="text-gray-900 font-medium">{user?.name}</span>. Here is what is happening across the department today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-mono text-gray-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Environment: <span className="text-gray-900 font-semibold capitalize">{environment}</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Faculty"
          value="0"
          icon={Users}
        />
        <DashboardCard
          title="Active Programs"
          value="0"
          icon={GraduationCap}
        />
        <DashboardCard
          title="Student Projects"
          value="0"
          icon={FolderKanban}
        />
        <DashboardCard
          title="Published News"
          value="0"
          icon={Newspaper}
        />
      </div>

      {/* Welcome / Quick Guide Box */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-blue-600">
          <GraduationCap size={140} />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 font-mono">
          Computer Science Department Portal
        </h2>
        <p className="mt-2 text-xs text-gray-500 max-w-2xl leading-relaxed">
          From this administrative console, you can oversee department resources, maintain public announcements, update faculty directories, and moderate incoming student projects and research details. Use the sidebar navigation to jump between modules.
        </p>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-wider text-gray-500">
          {title}
        </p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-extrabold tracking-tight text-gray-900 font-sans">
          {value}
        </p>
      </div>
    </div>
  );
}