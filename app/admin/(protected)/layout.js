import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import AdminShell from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
      />

      <AdminShell user={user}>
        {children}
      </AdminShell>
    </>
  );
}