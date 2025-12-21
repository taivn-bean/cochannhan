import { LoadingSpinner } from "@/components/ui/loading-sprinner";
import { Suspense } from "react";

export default function Page({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}
