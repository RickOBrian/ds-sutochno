export function BentoSkeleton() {
  return (
    <div className="col-span-full flex min-w-0 flex-col gap-2 sm:gap-3 lg:grid lg:grid-cols-5 lg:gap-5">
      <div className="h-[7.5rem] animate-pulse rounded-2xl bg-zinc-900/90 sm:h-28 lg:col-span-2 lg:h-[168px] lg:rounded-[2rem]" />
      <div className="grid grid-cols-1 gap-2 min-[520px]:grid-cols-2 sm:gap-2.5 lg:contents lg:gap-5">
        <div className="h-14 animate-pulse rounded-xl bg-white/80 sm:h-16 lg:h-[168px] lg:rounded-[2rem]" />
        <div className="h-14 animate-pulse rounded-xl bg-white/80 sm:h-16 lg:h-[168px] lg:rounded-[2rem]" />
        <div className="h-14 animate-pulse rounded-xl bg-white/80 sm:h-16 lg:h-[168px] lg:rounded-[2rem]" />
      </div>
    </div>
  );
}
