import { useAuthCallback } from "@/hooks/queries/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";

  const { mutate: authCallback, isPending: isAuthCallbackPending } =
    useAuthCallback();

  useEffect(() => {
    if (code) {
      authCallback(code, {
        onSuccess: () => {
          router.push(next);
        },
        onError: () => {
          router.push("/login");
        },
      });
    } else {
      router.push(next);
    }
  }, [code, next]);

  return <div>Đang xử lý đăng nhập...</div>;
}
