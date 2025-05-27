import { LoaderCircle } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="h-1/2 w-full flex items-center justify-center">
      <LoaderCircle className="animate-spin " />
    </div>
  );
}
