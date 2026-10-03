export async function getDepartmentData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/homepage`, {
      next: { revalidate: 259200 }, 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch department homepage data");
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return null;
  }
}