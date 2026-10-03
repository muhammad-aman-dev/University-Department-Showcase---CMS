import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);

    await connectDB();

    const user = await User.findById(payload.userId).select(
      "-passwordHash"
    );

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      isActive: user.isActive,
    };
  } catch {
    return null;
  }
}