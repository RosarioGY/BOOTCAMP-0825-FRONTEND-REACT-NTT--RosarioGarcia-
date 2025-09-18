import { useEffect, useRef, useState } from "react";
import { CATEGORY_ES, uiES, capitalize } from '@/shared/utils/locale';

type Props = {
  categories: string[];
  selected: string | 'Todos';
  onSelect: (c: string | 'Todos') => void;
};

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollByStep = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const step = Math.max(200, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="chips-wrap">
      <button
        className="chips-nav left"
        onClick={() => scrollByStep(-1)}
        disabled={!canLeft}
        aria-label="Ver anteriores"
      >
        ‹
      </button>

      <div
        className="chips-viewport"
        ref={ref}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") scrollByStep(1);
          if (e.key === "ArrowLeft") scrollByStep(-1);
        }}
      >
        <button
          className={`category-chip ${selected === "Todos" ? "is-active" : ""}`}
          onClick={() => onSelect("Todos")}
        >
          {uiES.all}
        </button>

        {categories.map((c) => (
          <button
            key={c}
            className={`category-chip ${selected === c ? "is-active" : ""}`}
            onClick={() => onSelect(c)}
            aria-pressed={selected === c}
          >
            {CATEGORY_ES?.[c] ?? capitalize(c)}
          </button>
        ))}
      </div>

      <button
        className="chips-nav right"
        onClick={() => scrollByStep(1)}
        disabled={!canRight}
        aria-label="Ver siguientes"
      >
        ›
      </button>
    </div>
  );
}
