import { createContext } from "react";
import { ISharedIntersectionObserverPublicInterface } from "./types";

export const SharedIntersectionObserverContext =
  createContext<ISharedIntersectionObserverPublicInterface | null>(null);
