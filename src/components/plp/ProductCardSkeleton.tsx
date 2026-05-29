// src/components/plp/ProductCardSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton rounded-lg" style={{ aspectRatio: '3/4' }} />
      <div className="mt-3 flex flex-col gap-2">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}
