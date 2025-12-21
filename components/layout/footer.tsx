import Link from "next/link";
import { Book, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Book className="h-5 w-5" />
              <span className="font-bold text-lg">Cổ Chân Nhân</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nền tảng đọc truyện cổ chân nhân dành cho cổ bu
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liên Kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link 
                  href="/feedback" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Góp ý - Báo lỗi
                </Link>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                  Ủng hộ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Chính Sách</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Cổ Chân Nhân. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
