// WIP, throws log errors
// Overview: redirect .html URLs

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// config with custom matcher
export const config = {
  matcher: ["/(.*)\\.html"],
};

export default function middleware(request: NextRequest) {
  console.log("1", request);
  const url = new URL(request.url);
  console.log("2", url);
  if (url.pathname.endsWith(".html")) {
    console.log("3a red", url);
    return NextResponse.redirect(new URL(url.href.replace(/\.html$/, "")));
  }
  console.log("3b rew", url);
  return NextResponse.rewrite(url);
}
