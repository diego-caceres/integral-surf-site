import { createClient } from "@supabase/supabase-js";

async function pingDatabase() {
  // Check if environment variables are set
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE!;

  if (!supabaseUrl || !supabaseServiceRole) {
    console.error(
      "Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE"
    );
    process.exit(1);
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceRole);

  try {
    // Simple query to wake up the database
    const { error } = await supabase
      .from("trips")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      console.error("Database ping failed:", error);
      process.exit(1);
    }

    console.log("Database ping successful at", new Date().toISOString());
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error pinging database:", err);
    process.exit(1);
  }
}

pingDatabase();
