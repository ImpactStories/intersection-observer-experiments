import { useCallback, useRef, useState } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
import { useIsIntersecting } from "./useIsIntersecting";

export const IntersectionAwareWrapper = ({
  children,
  minHeight,
}: React.PropsWithChildren<{ minHeight: string }>) => {
  const [dimensions, setDimensions] = useState<{
    width: string;
    height: string;
  }>({ width: `auto`, height: `auto` });
  const innerRef = useRef<HTMLElement | null>();
  const [setRef, isIntersecting] = useIsIntersecting();

  const innerSetRef = useCallback(
    (node: HTMLElement | null) => {
      setRef(node);

      innerRef.current = node;
    },
    [setRef]
  );

  useIsomorphicLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) {
      return;
    }

    if (isIntersecting) {
      // node.style.width = 'auto';
      node.style.height = "auto";

      const height = Math.ceil(node.offsetHeight);
      const width = Math.ceil(node.offsetWidth);

      setDimensions({ height: `${height}px`, width: `${width}px` });
    }
  }, [isIntersecting]);

  if (!isIntersecting) {
    return (
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height === "auto" ? dimensions.height : undefined,
          minHeight:
            dimensions.height === "auto" ? minHeight : dimensions.height,
        }}
        ref={innerSetRef}
      />
    );
  }

  return (
    <div style={{ width: "auto", height: "auto" }} ref={innerSetRef}>
      {children}
    </div>
  );
};
