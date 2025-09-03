'use client';

export default function TicketsError({ error }: { error: Error }) {
  return (
    <div className="rounded-md border p-6">
      <p className="font-medium">Gagal memuat Tickets</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
}
