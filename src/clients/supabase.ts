import { createClient } from "../deps.ts";
import { SUPABASE_KEY, SUPABASE_URL } from "../utils/secrets.ts";

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_KEY!,
  {
    fetch: self.fetch,
  },
);

export default supabase;
