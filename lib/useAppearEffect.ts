import { RefObject, useEffect } from "react";

export function useAppearEffect(
  containerRef: RefObject<HTMLElement | null>,
  { stagger = 0.08, duration = 0.6 }: { stagger?: number; duration?: number } = {}
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const elements = Array.from(container.querySelectorAll<HTMLElement>("[data-appear]"));
    if (!elements.length) return;

    elements.forEach((el, i) => {
      el.classList.remove("appear-effect");
      void el.offsetWidth;
      el.style.animationDelay = `${i * stagger}s`;
      el.style.animationDuration = `${duration}s`;
      el.classList.add("appear-effect");
      const cleanup = () => {
        el.classList.remove("appear-effect");
        el.style.animationDelay = "";
        el.style.animationDuration = "";
      };
      el.addEventListener("animationend", cleanup, { once: true });
      setTimeout(cleanup, (i * stagger + duration + 0.15) * 1000);
    });
  }, [containerRef, stagger, duration]);
}
