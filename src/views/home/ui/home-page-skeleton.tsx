import { Skeleton } from "@/shared/ui";

export function HomePageSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto pb-24">
      <div className="p-4 space-y-6">
        {/* Hero skeleton */}
        <div className="text-center py-8">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto mb-6" />
          <Skeleton className="h-12 w-40 mx-auto rounded-xl" />
        </div>

        {/* Rating list skeleton */}
        <div>
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
