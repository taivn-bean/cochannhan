// app/login/page.tsx
"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons/google-icon";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin, useOAuthLogin } from "@/hooks/queries/auth";
import { useAuthStore } from "@/stores/auth.store";

// ✅ Zod Schema for Login Form
const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu quá dài"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  // ✅ Auth hooks
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: loginWithGoogle, isPending: isGooglePending } =
    useOAuthLogin();
  const { user, isLoading: isAuthLoading } = useAuthStore();

  // Helper to get safe redirect path (exclude auth pages)
  const getSafeRedirect = () => {
    const authPages = [
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
    ];
    if (authPages.includes(redirect)) {
      return "/";
    }
    return redirect;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user && !isAuthLoading) {
      router.push(getSafeRedirect());
    }
  }, [user, isAuthLoading, router]);

  // ✅ Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle("google");
    } catch (error: any) {
      console.error("Google login error:", error);
    }
  };

  // ✅ Email/Password Sign-In with RHF
  const onSubmit = async (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        router.push(getSafeRedirect());
      },
    });
  };

  const isPending = isLoginPending || isGooglePending || isSubmitting;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Đăng nhập tài khoản</CardTitle>
              <CardDescription>
                Nhập email và mật khẩu để đăng nhập
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  {/* ✅ Email Field */}
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      disabled={isPending}
                      autoComplete="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <FieldError className="text-destructive">
                        {errors.email.message}
                      </FieldError>
                    )}
                  </Field>

                  {/* ✅ Password Field */}
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                      <button
                        type="button"
                        onClick={() => router.push("/forgot-password")}
                        className="text-xs text-muted-foreground hover:text-primary hover:underline"
                        disabled={isPending}
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      disabled={isPending}
                      autoComplete="current-password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <FieldError className="text-destructive">
                        {errors.password.message}
                      </FieldError>
                    )}
                  </Field>

                  {/* ✅ Login Buttons */}
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isLoginPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang đăng nhập...
                        </>
                      ) : (
                        "Đăng nhập"
                      )}
                    </Button>

                    {/* ✅ Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Hoặc
                        </span>
                      </div>
                    </div>

                    {/* ✅ Google Button */}
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isPending}
                      className="w-full"
                    >
                      {isGooglePending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang chuyển hướng...
                        </>
                      ) : (
                        <>
                          <GoogleIcon className="mr-2 h-4 w-4" />
                          Đăng nhập với Google
                        </>
                      )}
                    </Button>

                    <FieldDescription className="text-center">
                      Chưa có tài khoản?{" "}
                      <button
                        type="button"
                        onClick={() => router.push("/signup")}
                        className="underline underline-offset-4 hover:text-primary"
                        disabled={isPending}
                      >
                        Đăng ký ngay
                      </button>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
