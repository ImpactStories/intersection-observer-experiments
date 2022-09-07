import { useState, useRef, useLayoutEffect, type HTMLAttributes } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
import { SharedIntersectionObserverContext } from "./SharedIntersectionObserverContext";
import { ISharedIntersectionObserverPublicInterface } from "./types";

const createSharedIntersectionObserver = (
  root: HTMLElement
): ISharedIntersectionObserverPublicInterface => {
  if (typeof window === "undefined") {
    return {
      observe: () => null,
      unobserve: () => null,
    };
  }
  const listeners = new WeakMap();

  let io = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!listeners.has(entry.target)) {
          return;
        }
        const callback = listeners.get(entry.target);
        callback(entry);
      });
    },
    {
      root,
      rootMargin: "10px",
      // define how often the elements are observed based on the element position
      threshold: [0, 0.25, 0.35, 0.5, 0.66, 0.75, 1],
    }
  );

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

type SharedIntersectionObserverContainerProps = React.PropsWithChildren<{
  className?: HTMLAttributes<HTMLDivElement>["className"];
  style?: HTMLAttributes<HTMLDivElement>["style"];
}>;

export const SharedIntersectionObserverContainer = ({
  children,
  className,
  style,
}: SharedIntersectionObserverContainerProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sharedInstanceRef =
    useRef<ISharedIntersectionObserverPublicInterface | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) {
      console.error(`containerRef.current is null`);
      return;
    }
    sharedInstanceRef.current = createSharedIntersectionObserver(
      containerRef.current
    );
    setIsMounted(true);
  }, []);

  return (
    <SharedIntersectionObserverContext.Provider
      value={sharedInstanceRef.current}
    >
      <div ref={containerRef} className={className} style={style}>
        {isMounted ? children : null}
      </div>
    </SharedIntersectionObserverContext.Provider>
  );
};
