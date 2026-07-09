import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · JuliusCapital`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
