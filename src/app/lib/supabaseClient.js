import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
    'https://biqeoxbrwbkmrwlqprvf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpcWVveGJyd2JrbXJ3bHFwcnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDE2ODQsImV4cCI6MjA3MTAxNzY4NH0.DsVE-Z3sirPfHQ1fbfKyH93BVEDPN6UxJzhr7bKbHMA'
);
