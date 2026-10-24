import PublicationsAdminClient from "./PublicationsAdminClient";

export const metadata = {
  title: "Manage Publications | Admin",
  description: "Manage department research publications.",
};

export default function PublicationsAdminPage() {
  return <PublicationsAdminClient />;
}