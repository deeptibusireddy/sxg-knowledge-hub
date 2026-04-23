import { useEffect } from 'react';

/**
 * Fluent UI's tabster library creates hidden dummy <i> elements for keyboard
 * focus management. They carry `tabindex="0"` combined with `aria-hidden="true"`,
 * which violates the axe "aria-hidden-focus" rule (focusable content must not be
 * aria-hidden).
 *
 * Setting `tabindex="-1"` resolves the violation: the elements remain in the DOM
 * for tabster's programmatic focus management but are no longer reachable via the
 * Tab key, so `aria-hidden="true"` is valid. Safe because the app's tabster
 * config uses `controlTab: false` (native browser Tab handling).
 *
 * Ported from SxG.AI.FrontierAgentPlatform ClientApp/src/hooks/useTabsterA11yFix.ts.
 */
export function useTabsterA11yFix(): void {
  useEffect(() => {
    let scheduled = false;

    const fixAll = () => {
      document
        .querySelectorAll('[data-tabster-dummy][tabindex="0"]')
        .forEach((el) => el.setAttribute('tabindex', '-1'));
      scheduled = false;
    };

    fixAll();

    const observer = new MutationObserver(() => {
      if (!scheduled) {
        scheduled = true;
        queueMicrotask(fixAll);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex'],
    });

    return () => observer.disconnect();
  }, []);
}
