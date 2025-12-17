"use client";

import { BookOpen, User } from "lucide-react";
import type { Book } from "@/types/type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/${book.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader className="p-2 sm:p-3">
          <div className="aspect-[2/3] relative mb-2">
            <img
              loading="lazy"
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title || ""}
              className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <CardTitle className="text-sm sm:text-lg line-clamp-2 leading-tight">
            {book.title || ""}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs sm:text-sm">
            <User className="h-3 w-3" />
            <span className="line-clamp-1">{book.author || ""}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 hidden sm:block">
            {book.description || ""}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {book.chapters || 0} chương
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
