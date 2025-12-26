"use client";

import { Home, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <BookOpen className="h-24 w-24 text-primary relative z-10 mx-auto" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">
              Trang không tìm thấy
            </h2>
            <p className="text-muted-foreground">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
              chuyển.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Nếu bạn nghĩ đây là lỗi, vui lòng{" "}
            <Link
              href="/feedback"
              className="text-primary hover:underline font-medium"
            >
              báo cáo cho chúng tôi
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
