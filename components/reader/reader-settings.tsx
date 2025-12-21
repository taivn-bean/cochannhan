"use client";

import { useState } from "react";
import { Palette, RotateCcw, Settings, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useReaderSettingsStore } from "@/stores/reader-settings.store";
import { fontMap } from "@/app/fontMap";
import { useTheme } from "next-themes";

interface ReaderSettings {
  fontSize: number;
  fontFamily: string;
  theme: string;
  lineHeight: number;
}

export function ReaderSettings() {
  const { settings, updateSettings } = useReaderSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const updateSetting = (key: keyof ReaderSettings, value: any) => {
    updateSettings({
      ...settings,
      [key]: value,
    });
    if (key === "theme") {
      setTheme(value);
    }
  };

  const resetSettings = () => {
    updateSettings({
      fontSize: 16,
      fontFamily: fontMap.Inter.className,
      theme: "light",
      lineHeight: 1.6,
    });
    setTheme("light");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Tùy chỉnh</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Cài đặt đọc</h3>
            <Button variant="ghost" size="sm" onClick={resetSettings}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Type className="h-4 w-4" />
              Cỡ chữ: {settings.fontSize}px
            </label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => updateSetting("fontSize", value[0])}
              min={12}
              max={28}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>12px</span>
              <span>28px</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Font chữ</label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => updateSetting("fontFamily", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(fontMap).map((font) => (
                  <SelectItem key={font.label} value={font.className}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Khoảng cách dòng: {settings.lineHeight.toFixed(1)}
            </label>
            <Slider
              value={[settings.lineHeight]}
              onValueChange={(value) => updateSetting("lineHeight", value[0])}
              min={1.2}
              max={2.5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1.2</span>
              <span>2.5</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Palette className="h-4 w-4" />
              Chủ đề màu
            </label>
            <Select
              value={settings.theme}
              onValueChange={(value) => updateSetting("theme", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">🌞 Sáng</SelectItem>
                <SelectItem value="dark">🌙 Tối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
