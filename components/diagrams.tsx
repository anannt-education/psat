export function DeliveryCostDiagram() {
  return (
    <figure className="my-4 rounded-xl border bg-card p-4">
      <svg viewBox="0 0 320 180" className="h-auto w-full max-w-md" role="img" aria-labelledby="dc-title dc-desc">
        <title id="dc-title">Delivery cost against distance</title>
        <desc id="dc-desc">
          A line starting at 12 rupees when distance is 0 kilometres and rising by 3 rupees each kilometre, through the points (0, 12), (1, 15), and (2, 18).
        </desc>
        <line x1="40" y1="150" x2="300" y2="150" stroke="currentColor" strokeWidth="1.5" />
        <line x1="40" y1="150" x2="40" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <text x="292" y="168" fontSize="11">d (km)</text>
        <text x="8" y="28" fontSize="11">C</text>
        <polyline fill="none" stroke="var(--primary)" strokeWidth="2.5" points="40,118 100,100 160,82 220,64 280,46" />
        <circle cx="40" cy="118" r="4" fill="var(--primary)" />
        <circle cx="100" cy="100" r="3.5" fill="var(--primary)" />
        <circle cx="160" cy="82" r="3.5" fill="var(--primary)" />
        <text x="46" y="114" fontSize="10">12</text>
        <text x="108" y="96" fontSize="10">15</text>
        <text x="48" y="168" fontSize="10">0</text>
        <text x="96" y="168" fontSize="10">1</text>
        <text x="156" y="168" fontSize="10">2</text>
      </svg>
      <figcaption className="mt-2 text-xs text-muted-foreground">
        Table: d = 0 → C = 12; d = 1 → C = 15; d = 2 → C = 18. Rise of 3 rupees per kilometre; intercept 12.
      </figcaption>
    </figure>
  )
}

export function WaterVolumeDiagram() {
  return (
    <figure className="my-4 rounded-xl border bg-card p-4">
      <svg viewBox="0 0 320 180" className="h-auto w-full max-w-md" role="img" aria-labelledby="wv-title wv-desc">
        <title id="wv-title">Water volume against time</title>
        <desc id="wv-desc">
          A line starting at 8 litres when time is 0 minutes and rising by 2 litres each minute.
        </desc>
        <line x1="40" y1="150" x2="300" y2="150" stroke="currentColor" strokeWidth="1.5" />
        <line x1="40" y1="150" x2="40" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <text x="288" y="168" fontSize="11">t (min)</text>
        <text x="8" y="28" fontSize="11">V</text>
        <polyline fill="none" stroke="var(--primary)" strokeWidth="2.5" points="40,126 100,114 160,102 220,90 280,78" />
        <circle cx="40" cy="126" r="4" fill="var(--primary)" />
        <text x="46" y="122" fontSize="10">8 L</text>
      </svg>
      <figcaption className="mt-2 text-xs text-muted-foreground">
        New context for the same linear roles: start 8 litres, rate 2 litres per minute.
      </figcaption>
    </figure>
  )
}

export function ItemDiagram({ kind }: { kind?: string }) {
  if (kind === "delivery-cost") return <DeliveryCostDiagram />
  if (kind === "water-volume") return <WaterVolumeDiagram />
  return null
}
