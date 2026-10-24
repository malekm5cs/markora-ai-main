
import { useEffect } from "react";

export function SiteProtection() {
  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const preventImageDrag = (event: DragEvent) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    };

    const preventDevToolsShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // Block F12
      if (event.key === "F12") {
        event.preventDefault();
        return;
      }

      // Block common developer tools shortcuts
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        ["i", "j", "c"].includes(key)
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventImageDrag);
    document.addEventListener("keydown", preventDevToolsShortcuts);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventImageDrag);
      document.removeEventListener("keydown", preventDevToolsShortcuts);
    };
  }, []);

  return null;
}

