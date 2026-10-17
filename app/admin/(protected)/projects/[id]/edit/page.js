
import EditStudentProjectForm from "@/components/admin/student-projects/EditStudentProjectForm";

export default async function EditStudentProjectPage({ params }) {
  const { id } = await params;

  return <EditStudentProjectForm projectId={id} />;
}
