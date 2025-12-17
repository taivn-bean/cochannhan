"use client";

import type { Book } from "@/types/type";
import { BookCard } from "@/components/book/book-card";

export function BookGrid({ books }: { books: Array<Book> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
      {books.map((book) => (
        <BookCard key={book.slug} book={book} />
      ))}
    </div>
  );
}
