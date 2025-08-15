import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  fullpage?: boolean;
  label?: string;
  showSkeleton?: boolean;
};

export default function Loading({
  fullpage,
  label = "loading...",
  showSkeleton = false,
}: Props) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    fullpage ? (
      <div className=" fixed inset-0 z-50 grid place items-center bg-backgoround/60 backdrop-blur-sm ">
        {children}
      </div>
    ) : (
      <div className="flex itmes-cnter justify-center py-8 "> {children} </div>
    );
  return (
    <Wrapper>
      {showSkeleton ? (
        <div className="space-y-4 w-full max-w-sm">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      )}
    </Wrapper>
  );
}
