// INGFO: Placeholder detail ticket—data akan diisi di Step 9. 🔎

type Params = { id: string };

// Next 14.2+/15: params is async → await dulu
export default async function TicketDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold">Ticket Detail</h1>
      <p className="text-sm text-muted-foreground">ID: {id}</p>

      <div className="rounded-md border p-6 text-sm text-muted-foreground">
        Detail, komentar, dan riwayat akan diisi di langkah 9–10.
      </div>
    </section>
  );
}
