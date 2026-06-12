import { useEffect, type RefObject } from "react";

type Options = {
  /** Si es false, el hook no hace nada (útil para overlays con prop `open`). */
  enabled?: boolean;
  /** Elemento a enfocar al abrir. Por defecto, el contenedor del diálogo. */
  initialFocusRef?: RefObject<HTMLElement | null>;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accesibilidad compartida para modales/overlays:
 * - Cierra con Escape.
 * - Bloquea el scroll de fondo mientras está abierto.
 * - Mueve el foco al abrir (al `initialFocusRef` o al contenedor).
 * - Atrapa el foco con Tab/Shift+Tab dentro del diálogo (focus trap).
 *
 * Patrón de referencia: `components/product-modal.tsx`.
 */
export function useModalA11y(
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  options: Options = {},
) {
  const { enabled = true, initialFocusRef } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    (initialFocusRef?.current ?? containerRef.current)?.focus?.();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // containerRef / initialFocusRef son estables (refs).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, onClose]);
}
