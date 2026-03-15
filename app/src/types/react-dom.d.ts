declare module "react-dom" {
  export function createPortal(
    children: React.ReactNode,
    container: Element | DocumentFragment
  ): React.ReactPortal;
  export function flushSync<R>(fn: () => R): R;
  export function render(
    element: React.ReactElement,
    container: Element | null
  ): void;
}
