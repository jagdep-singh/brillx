import { createClient } from "@supabase/supabase-js"

const DEFAULT_SUPABASE_URL = "https://pitdjwryopcodcjeftmd.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_7aTMPZG1PI6KHnOWfA67lw_kzKzTCar";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdGRqd3J5b3Bjb2RjamVmdG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTY2MjgsImV4cCI6MjA5NzI3MjYyOH0.02C2YO4RyMeplD4fdM_VpRgr1e2zY9UBkDJivTESJTo";

export const createSupabaseClient = () => {
    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
    const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        DEFAULT_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then restart the dev server."
        );
    }

    return createClient(
        supabaseUrl,
        supabaseKey
    )
}

export const createSupabaseAdminClient = () => {
    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        throw new Error(
            "Missing SUPABASE_SERVICE_ROLE_KEY. Add your Supabase service role key to .env.local for Clerk-backed writes."
        );
    }

    return createClient(supabaseUrl, serviceRoleKey);
}
