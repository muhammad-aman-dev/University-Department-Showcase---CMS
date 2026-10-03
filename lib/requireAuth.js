import { getCurrentUser } from "@/lib/getCurrentUser";

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      user: null,
    };
  }

  return {
    authorized: true,
    user,
  };
}

export async function requireRole(roles = []) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      user: null,
    };
  }

  if (!roles.includes(user.role)) {
    return {
      authorized: false,
      user,
    };
  }

  return {
    authorized: true,
    user,
  };
}