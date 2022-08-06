import {
  SharedIntersectionObserverContainer,
  useIsIntersecting,
} from "../hooks/useSharedIntersectionObserver";
import { faker } from "@faker-js/faker";
import {
  Suspense,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type InfoDataType = { name: string };

type DynamicHeightListProps = {
  column1: Array<InfoDataType>;
  column2: Array<InfoDataType>;
};

const IntersectionAwareWrapper = ({
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

  useLayoutEffect(() => {
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

const InfoCard = ({ name }: InfoDataType) => {
  console.log("render", name);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "200px",
          height: `${Math.random() * 1000 * Math.random()}px`,
          backgroundColor: "#ccc",
        }}
      />
      <b>{name}</b>
    </div>
  );
};

export default function DynamicHeightList({
  column1,
  column2,
}: DynamicHeightListProps) {
  return (
    <Suspense fallback={null}>
      <div
        style={{
          height: "100vh",
          maxHeight: "100vh",
          width: "100vw",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
        }}
        aria-label="outer-container"
      >
        <SharedIntersectionObserverContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "400px",
              height: "100%",
              overflow: "scroll",
              padding: "0 20px",
            }}
            aria-label="column-1"
          >
            {column1.map((d, i) => (
              <IntersectionAwareWrapper key={i} minHeight={`100px`}>
                <InfoCard name={d.name} />
              </IntersectionAwareWrapper>
            ))}
          </div>
        </SharedIntersectionObserverContainer>
        <SharedIntersectionObserverContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "400px",
              height: "100%",
              overflow: "scroll",
              padding: "0 20px",
            }}
            aria-label="column-2"
          >
            {column2.map((d, i) => (
              <IntersectionAwareWrapper key={i} minHeight={`10%`}>
                <InfoCard name={d.name} />
              </IntersectionAwareWrapper>
            ))}
          </div>
        </SharedIntersectionObserverContainer>
      </div>
    </Suspense>
  );
}

export async function getServerSideProps(): Promise<{
  props: DynamicHeightListProps;
}> {
  return {
    props: {
      column1: Array.from([...new Array(50)]).map(() => {
        return {
          name: faker.name.firstName(),
        };
      }),
      column2: Array.from([...new Array(50)]).map(() => {
        return {
          name: faker.name.firstName(),
        };
      }),
    },
  };
}
