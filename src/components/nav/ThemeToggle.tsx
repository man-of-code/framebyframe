import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "@/hooks/useTheme";
import type { Theme } from "@/lib/theme";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <ToggleGroup
      type="single"
      value={theme}
      spacing={3}
      className="theme-toggle"
      aria-label="Color theme"
      onValueChange={(value) => {
        if (value === "dark" || value === "light" || value === "system") setTheme(value);
      }}
    >
      {OPTIONS.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value} className="theme-option">
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
