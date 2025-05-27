"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { BookOverview } from "@/components/book/book-overview";
import { useServices } from "@/hooks/use-services";
import { LoadingSpinner } from "@/components/ui/loading-sprinner";

export default function BookPage() {
  const params = useParams();
  const slug = params.bookSlug as string;

  const { book, chapterList, loading } = useServices(slug);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      {book && <BookOverview book={book} chapters={chapterList} />}
    </div>
  );
}
