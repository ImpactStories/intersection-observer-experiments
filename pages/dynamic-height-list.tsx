import {
  SharedIntersectionObserverContainer,
  IntersectionAwareWrapper,
} from "../shared-intersection-observer";
import { faker } from "@faker-js/faker";
import { Suspense } from "react";

type InfoDataType = { name: string };

type DynamicHeightListProps = {
  column1: Array<InfoDataType>;
  column2: Array<InfoDataType>;
};

const InfoCard = ({ name }: InfoDataType) => {
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

const INTERSECTION_OBSERVER_THRESHOLD = [0, 0.25, 1];

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
        <SharedIntersectionObserverContainer
          rootMargin="100px"
          threshold={INTERSECTION_OBSERVER_THRESHOLD}
        >
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
        <SharedIntersectionObserverContainer
          rootMargin="100px"
          threshold={INTERSECTION_OBSERVER_THRESHOLD}
        >
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
