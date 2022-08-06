import {
  useState,
  useCallback,
  useRef,
  createContext,
  useLayoutEffect,
  useContext,
} from "react";

interface ISharedIntersectionObserverPublicInterface {
  observe: (
    target: HTMLElement,
    callback: (entry: IntersectionObserverEntry) => void
  ) => void;
  unobserve: (target: HTMLElement) => void;
}

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

const SharedIntersectionObserverContext =
  createContext<ISharedIntersectionObserverPublicInterface | null>(null);

export const SharedIntersectionObserverContainer = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sharedInstanceRef =
    useRef<ISharedIntersectionObserverPublicInterface | null>(null);

  useLayoutEffect(() => {
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
      <div ref={containerRef}>{isMounted ? children : null}</div>
    </SharedIntersectionObserverContext.Provider>
  );
};

export const useIsIntersecting = (): [
  (node: HTMLElement | null) => void,
  boolean
] => {
  const observer = useContext(SharedIntersectionObserverContext);

  // This if block only exists to guarantee rendering on the server
  if (typeof window === "undefined") {
    const [isIntersecting] = useState(false);
    const ref = useRef<HTMLElement | null>(null);
    const setRef = useCallback((node: HTMLElement | null) => {
      ref.current = node;
    }, []);

    return [setRef, isIntersecting];
  } else {
    const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
    const ref = useRef<HTMLElement | null>(null);
    const setRef: (node: HTMLElement | null) => void = useCallback(
      (node: HTMLElement | null) => {
        // if there is already a ref, unobserve first
        // before observing a new node
        if (ref.current) {
          observer!.unobserve(ref.current);
        }

        // observe the new node
        if (node) {
          observer!.observe(node, (entry) => {
            setIsIntersecting(entry.isIntersecting);
          });
        }

        // Assign new node to ref
        ref.current = node;
      },
      [observer]
    );

    return [setRef, isIntersecting];
  }
};
