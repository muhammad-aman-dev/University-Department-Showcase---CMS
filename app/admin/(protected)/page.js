import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Welcome back, {user?.name}.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Faculty"
          value="0"
        />

        <DashboardCard
          title="Programs"
          value="0"
        />

        <DashboardCard
          title="Projects"
          value="0"
        />

        <DashboardCard
          title="News"
          value="0"
        />
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">
          Welcome to the Admin Panel
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          From here you will manage the Computer Science
          Department website content.
        </p>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}