import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./server/auth";

const retreiveLocationId = (request: NextRequest) => {
  const locationId = request.cookies.get("location_id");
  return locationId;
};

const validateLocationId = async (request: NextRequest) => {
  if (!request.nextUrl.pathname.startsWith("/operators")) {
    return NextResponse.next();
  }
  const searchParams = new URLSearchParams(request.nextUrl.search);
  const searchLocationId = searchParams.get("location_id");
  const cookiesLocationId = request.cookies.get("location_id");
  const url = request.nextUrl.clone();

  const appCaller = appRouter.createCaller({
    db: db,
    headers: request.headers,
    session: await auth(),
  });
  const availableLocations = await appCaller.location
    .myLocations()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return [];
    });
  if (availableLocations.length === 0) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url.toString());
  }
  if (
    !!searchLocationId &&
    availableLocations.some((loc) => loc.location_id === searchLocationId)
  ) {
    const Response = NextResponse.next();
    Response.cookies.set("location_id", searchLocationId);
    return Response;
  }
  if (
    !!cookiesLocationId &&
    availableLocations.some(
      (loc) => loc.location_id === cookiesLocationId.value,
    )
  ) {
    url.searchParams.set("location_id", cookiesLocationId.value);
    const Response = NextResponse.redirect(url.toString());
    return Response;
  }
  const redirectLocationId = `${availableLocations[0]?.location_id}`;
  url.searchParams.set("location_id", redirectLocationId);
  const Response = NextResponse.redirect(url.toString());
  Response.cookies.set("location_id", redirectLocationId, { path: "/" });
  return Response;
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("middleware");
  const res = await validateLocationId(request);
  return res;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
