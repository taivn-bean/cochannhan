"use client";

import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { useFetchAllBooks } from "@/hooks/queries/books";
import { BookGrid } from "@/components/book/book-grid";
import { Button } from "@/components/ui/button";
import { useRecentAccessStore } from "@/stores/recentAccessStore";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: books } = useFetchAllBooks();
  const router = useRouter();
  const { items: recentItems } = useRecentAccessStore();

  const handleRecentAccess = (bookSlug: string, chapterSlug: string) => {
    router.push(`/${bookSlug}/${chapterSlug}`);
  };

  // Helper function to get book name from slug
  const getBookName = (bookSlug: string): string => {
    const book = books?.find((b) => b.slug === bookSlug);
    return book?.title || bookSlug;
  };

  // Show max 5 recent items
  const displayItems = recentItems.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Cổ Chân Nhân</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Khám phá thế giới tri thức qua từng trang sách
          </p>
        </div>

        {/* Recent Access Section */}
        {displayItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Truy cập gần đây</h2>
            </div>
            <div className="flex flex-col gap-2">
              {displayItems.map((item) => (
                <Button
                  key={`${item.bookSlug}-${item.chapterSlug}`}
                  onClick={() => handleRecentAccess(item.bookSlug, item.chapterSlug)}
                  variant="outline"
                  className="flex items-center gap-2 justify-start hover:bg-primary hover:text-primary-foreground transition-colors border-gray-600 h-auto py-3"
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col items-start gap-0.5 flex-1 overflow-hidden">
                    <span className="text-xs text-muted-foreground">
                      {getBookName(item.bookSlug)}
                    </span>
                    <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap w-full text-left">
                      {item.title}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Button>
              ))}
            </div>
          </div>
        )}

        <div>
          <BookGrid books={books || []} />
        </div>
      </main>
    </div>
  );
}
