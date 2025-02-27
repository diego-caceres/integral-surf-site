import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE!;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRole, {
  auth: { persistSession: false }, // No queremos sesiones en el backend
});
