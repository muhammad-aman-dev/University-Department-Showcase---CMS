export async function POST() {
    const response = Response.json({
      success: true,
      message: "Logged out successfully",
    });
  
    response.headers.append(
      "Set-Cookie",
      [
        "admin_token=",
        "HttpOnly",
        "Path=/",
        "SameSite=Lax",
        "Max-Age=0",
        process.env.NODE_ENV === "production" ? "Secure" : "",
      ]
        .filter(Boolean)
        .join("; ")
    );
  
    return response;
  }