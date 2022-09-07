export interface ISharedIntersectionObserverPublicInterface {
  observe: (
    target: HTMLElement,
    callback: (entry: IntersectionObserverEntry) => void
  ) => void;
  unobserve: (target: HTMLElement) => void;
}
