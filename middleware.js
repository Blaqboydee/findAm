// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", 
  },
});

// protect /register (and any nested paths)
export const config = {
  matcher: ["/register", "/register/:path*"],
};
