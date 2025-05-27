"use client";

import { useParams } from "next/navigation";
import { BookOverview } from "@/components/book/book-overview";
import { useServices } from "@/hooks/use-services";

export default function BookPage() {
  const params = useParams();
  const slug = params.bookSlug as string;

  const { book, chapterList } = useServices(slug);

  return (
    <div className="min-h-screen bg-background">
      {book && <BookOverview book={book} chapters={chapterList} />}
    </div>
  );
}
