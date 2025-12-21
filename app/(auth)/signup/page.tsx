// app/signup/page.tsx
"use client";

import { Loader2 } from "lucide-react";
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
import { useSignup, useOAuthLogin } from "@/hooks/queries/auth";
import { useAuthStore } from "@/stores/auth.store";

// ✅ Zod Schema for Signup Form
const signupSchema = z
  .object({
    username: z.string().min(2, "Tên người dùng phải có ít nhất 2 ký tự"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(100, "Mật khẩu quá dài"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  // ✅ Auth hooks
  const { mutate: signup, isPending: isSignupPending } = useSignup();
  const { mutate: loginWithGoogle, isPending: isGooglePending } =
    useOAuthLogin();
  const { user, isLoading: isAuthLoading } = useAuthStore();

  // Helper to get safe redirect path
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

  // ✅ React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // ✅ Redirect nếu đã login
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
      console.error("Google signup error:", error);
    }
  };

  // ✅ Email/Password Sign-Up
  const onSubmit = async (data: SignupFormData) => {
    signup(
      {
        email: data.email,
        password: data.password,
        metadata: {
          username: data.username,
        },
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  const isPending = isSignupPending || isGooglePending || isSubmitting;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Đăng ký tài khoản</CardTitle>
              <CardDescription>Tạo tài khoản mới để bắt đầu</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="gap-4">
                  {/* ✅ Full Name Field */}
                  <Field>
                    <FieldLabel htmlFor="username">Tên người dùng</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Cổ Nguyệt Phương Nguyên"
                      disabled={isPending}
                      autoComplete="name"
                      {...register("username")}
                    />
                    {errors.username && (
                      <FieldError className="text-destructive">
                        {errors.username.message}
                      </FieldError>
                    )}
                  </Field>

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
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      disabled={isPending}
                      autoComplete="new-password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <FieldError className="text-destructive">
                        {errors.password.message}
                      </FieldError>
                    )}
                  </Field>

                  {/* ✅ Confirm Password Field */}
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Xác nhận mật khẩu
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      disabled={isPending}
                      autoComplete="new-password"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <FieldError className="text-destructive">
                        {errors.confirmPassword.message}
                      </FieldError>
                    )}
                  </Field>

                  {/* ✅ Signup Buttons */}
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isSignupPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang đăng ký...
                        </>
                      ) : (
                        "Đăng ký"
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
                          Đăng ký với Google
                        </>
                      )}
                    </Button>

                    <FieldDescription className="text-center">
                      Đã có tài khoản?{" "}
                      <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="underline underline-offset-4 hover:text-primary"
                        disabled={isPending}
                      >
                        Đăng nhập ngay
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
