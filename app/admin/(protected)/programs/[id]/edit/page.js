import ProgramForm from "@/components/admin/programs/ProgramForm";

export const metadata = {
  title: "Edit Program",
  description: "Edit an academic program.",
};

export default async function EditProgramPage({ params }) {
  const { id } = await params;

  return <ProgramForm mode="edit" programId={id} />;
}
