import { Link } from 'react-router'

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">About</h1>
      <p className="text-muted-foreground">
        This template wires up React Router, Zustand, TanStack Query, ky,
        Tailwind v4, shadcn/ui, lucide, sonner, and react-hook-form + zod —
        shared across a Vite web target and an Electron desktop target.
      </p>
      <Link to="/" className="text-primary text-sm underline">
        ← Back home
      </Link>
    </div>
  )
}
