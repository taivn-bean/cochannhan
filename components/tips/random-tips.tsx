"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { usePathname } from "next/navigation";

const tips = [
  "Vào Profile > Đồng bộ dữ liệu để lưu các dữ liệu quan trọng",
  "Đăng nhập để có trải nghiệm tốt hơn",
  "Nếu truyện lỗi hay bạn có ý tưởng gì mới, hãy gửi feedback để chúng tôi cải thiện",
  "Mọi ý kiến đóng góp đều được chúng tôi cân nhắc",
];

export function RandomTips() {
  const pathname = usePathname();
  const [currentTip, setCurrentTip] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Select random tip on route change
    const randomIndex = Math.floor(Math.random() * tips.length);
    setCurrentTip(tips[randomIndex]);

    // Trigger fade in animation
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="h-16 bg-accent border-y border-yellow-500 flex items-center px-6 rounded-xl mx-4">
      <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
        <div className="flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-chart-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm text-muted-foreground transition-opacity duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="font-medium text-foreground">Tip:</span>{" "}
            {currentTip}
          </p>
        </div>
      </div>
    </div>
  );
}
