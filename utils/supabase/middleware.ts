import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const DEFAULT_SUPABASE_URL = "https://pitdjwryopcodcjeftmd.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_7aTMPZG1PI6KHnOWfA67lw_kzKzTCar";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdGRqd3J5b3Bjb2RjamVmdG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTY2MjgsImV4cCI6MjA5NzI3MjYyOH0.02C2YO4RyMeplD4fdM_VpRgr1e2zY9UBkDJivTESJTo";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  DEFAULT_SUPABASE_ANON_KEY;

export const refreshSupabaseSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );

        supabaseResponse = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();

  return supabaseResponse;
};
