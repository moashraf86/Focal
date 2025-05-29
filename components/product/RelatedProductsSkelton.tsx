import { Skeleton } from "@/components/ui/skeleton";

export default function RelatedProductsSkeleton() {
  return (
    <section className="container max-w-screen-xl mb-20 space-y-10">
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-center font-light uppercase leading-tight tracking-tight">
        Available styles
      </h2>

      {/* Mobile skeleton: horizontal scroll */}
      <div className="grid auto-cols-[52vw] md:auto-cols-[35vw] grid-cols-none grid-flow-col gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="snap-center snap-always space-y-4">
            <Skeleton className="w-full h-[300px]" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>

      {/* Desktop skeleton: carousel */}
      <div className="w-full hidden lg:flex gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="md:basis-1/2 lg:basis-1/4 space-y-4">
            <Skeleton className="w-full h-[320px]" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}
