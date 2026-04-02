import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/proxy";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { supabaseResponse, supabase, user } = await createClient(req);

  const redirectTo = (path: string) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api");

  if (isPublicRoute) return supabaseResponse;

  if (!user) return redirectTo("/login");
  // console.log(user)

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  const role = profile.role;
  const onboardingComplete = profile.onboarding;

  if (role === "LEADER" && !onboardingComplete && pathname !== "/onboarding")
    return redirectTo("/onboarding");

  if (pathname === "/onboarding" && onboardingComplete)
    return redirectTo("/dashboard");

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
