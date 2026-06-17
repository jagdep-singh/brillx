import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components can read cookies, but may not be able to set them.
          // Middleware handles session refresh when Supabase Auth is enabled.
        }
      },
    },
  });
};
