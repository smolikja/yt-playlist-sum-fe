import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-neutral-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Youtube Playlist Summarizer
        </h1>
        <p className="text-neutral-400">
          Foundation setup complete with Next.js, Tailwind, Shadcn, and TanStack Query.
        </p>
        <div className="flex gap-2">
          <Button variant="default">Get Started</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </div>
    </div>
  );
}