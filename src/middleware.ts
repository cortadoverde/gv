export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/ruta-protegida/:path*"]
} 