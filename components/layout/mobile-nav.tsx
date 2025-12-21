"use client";

import { useState } from "react";
import { Book, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/constants/navigation";
import { useRouter } from "next/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left flex items-center gap-2">
            <Book className="h-5 w-5" />
            Cổ Chân Nhân
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => handleNavigate(item.href)}
              >
                <item.icon className={`h-4 w-4 ${item.className || ""}`} />
                {item.label}
              </Button>
            ))}
          </div>
          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  );
}
