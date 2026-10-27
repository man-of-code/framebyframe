import { useEffect } from "react";

// Kept apart from SearchPalette so the shortcut works before cmdk has loaded.
function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")
  );
}

export function usePaletteShortcut(onOpen: () => void): void {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const slash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target);
      const command = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!slash && !command) return;
      event.preventDefault();
      onOpen();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpen]);
}
