import { createContext, useContext } from "react";
import roomCapturing from "./roomCapturing";
import roomPlanner from "./roomPlanner";

export type Services = {
  roomCapturing: typeof roomCapturing,
  roomPlanner: typeof roomPlanner,
};

export const ServicesContext = createContext<Services>(undefined);

function useServices() {
  return useContext(ServicesContext);
};

export default useServices;
