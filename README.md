# Intersection Observer Experiments

This repository contains a collection of hooks & components to use IntersectionObservers in performant and easy ways.

For a full example, see [pages/dynamic-height-list.tsx](https://github.com/ImpactStories/intersection-observer-experiments/blob/master/pages/dynamic-height-list.tsx)

## Exports

- `SharedIntersectionObserverContainer`: Defines the root the IntersectionObserver uses and renders the Context provider for the shared IntersectionObserver instance. **This needs to be the scroll container**

- `IntersectionAwareWrapper`: A simple wrapper that considers the intersection state and renders either the `children` or an empty placeholder. After the children have been rendered once, it will remember this height for the placeholder.

- `useIsIntersecting` In more complex cases where multiple states have to be considered in addition to the intersection, this hook should be used to get the intersection state directly.

## Why **shared** Intersection observers?

Performance benchmarks have shown that using one instance with one root element & many callbacks is much more performant than using one instance for each component that should be watched

Read more here: https://www.bennadel.com/blog/3954-intersectionobserver-api-performance-many-vs-shared-in-angular-11-0-5.htm
and here:

## Development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
