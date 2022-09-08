import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  type HTMLAttributes,
} from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
import { SharedIntersectionObserverContext } from "./SharedIntersectionObserverContext";
import { ISharedIntersectionObserverPublicInterface } from "./types";

const createSharedIntersectionObserver = (
  init: IntersectionObserverInit
): ISharedIntersectionObserverPublicInterface => {
  if (typeof window === "undefined") {
    return {
      observe: () => null,
      unobserve: () => null,
    };
  }
  const listeners = new WeakMap();

  let io = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (!listeners.has(entry.target)) {
        return;
      }
      const callback = listeners.get(entry.target);
      callback(entry);
    });
  }, init);

  const publicInterface = {
    observe: (
      target: HTMLElement,
      callback: (entry: IntersectionObserverEntry) => void
    ) => {
      listeners.set(target, callback);
      io.observe(target);
    },
    unobserve: (target: HTMLElement) => {
      listeners.delete(target);
    },
  };

  return publicInterface;
};

type IntersectionObserverOptions = Pick<
  IntersectionObserverInit,
  "rootMargin" | "threshold"
>;

type SharedIntersectionObserverContainerProps = HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren<IntersectionObserverOptions>;

const SharedIntersectionObserverContainer = forwardRef<
  HTMLDivElement,
  SharedIntersectionObserverContainerProps
>(({ children, rootMargin, threshold, ...divProps }, forwardRef) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
    forwardRef,
    () => containerRef.current
  );

  const sharedInstanceRef =
    useRef<ISharedIntersectionObserverPublicInterface | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) {
      console.error(`containerRef.current is null`);
      return;
    }

    sharedInstanceRef.current = createSharedIntersectionObserver({
      root: containerRef.current,
      rootMargin,
      threshold,
    });
    setIsMounted(true);
  }, [rootMargin, threshold]);

  return (
    <SharedIntersectionObserverContext.Provider
      value={sharedInstanceRef.current}
    >
      <div ref={containerRef} {...divProps}>
        {isMounted ? children : null}
      </div>
    </SharedIntersectionObserverContext.Provider>
  );
});

SharedIntersectionObserverContainer.displayName =
  "SharedIntersectionObserverContainer";

export { SharedIntersectionObserverContainer };
