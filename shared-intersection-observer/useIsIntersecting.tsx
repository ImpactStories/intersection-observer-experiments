import { useState, useCallback, useRef, useContext } from "react";
import { SharedIntersectionObserverContext } from "./SharedIntersectionObserverContext";

export const useIsIntersecting = (): [
  (node: HTMLElement | null) => void,
  boolean
] => {
  const observer = useContext(SharedIntersectionObserverContext);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const ref = useRef<HTMLElement | null>(null);

  const setRef: (node: HTMLElement | null) => void = useCallback(
    (node: HTMLElement | null) => {
      if (typeof window === "undefined") {
        ref.current = node;
      }
      // if there is already a ref, unobserve first
      // before observing a new node
      if (ref.current) {
        observer!.unobserve(ref.current);
      }

      // observe the new node
      if (node) {
        observer!.observe(node, (entry: IntersectionObserverEntry) => {
          setIsIntersecting(entry.isIntersecting);
        });
      }

      // Assign new node to ref
      ref.current = node;
    },
    [observer]
  );

  return [setRef, isIntersecting];
};
