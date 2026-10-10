import ProgramForm from "@/components/admin/programs/ProgramForm";

export const metadata = {
title: "Create Program",
description: "Create a new academic program.",
};

export default function NewProgramPage() {
return <ProgramForm mode="create" />;
}