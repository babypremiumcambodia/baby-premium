import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  return (
    <main className="p-10">
      <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
    </main>
  );
}